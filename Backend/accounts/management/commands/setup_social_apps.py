from django.core.management.base import BaseCommand
from django.core.exceptions import ImproperlyConfigured
from django.contrib.sites.models import Site
from allauth.socialaccount.models import SocialApp
import os
from urllib.parse import urlparse


GOOGLE_PROVIDER = {
    "provider": "google",
    "name": "FocusFlow Google",
    "client_id_env": "GOOGLE_CLIENT_ID",
    "secret_env": "GOOGLE_CLIENT_SECRET",
}


def _is_truthy(value):
    return str(value or "").strip().lower() in {"1", "true", "yes", "on"}


def _site_domain():
    explicit = os.getenv("SITE_DOMAIN") or os.getenv("DJANGO_SITE_DOMAIN")
    if explicit:
        return explicit.strip().removeprefix("https://").removeprefix("http://").strip("/")

    backend_url = (
        os.getenv("BACKEND_URL")
        or os.getenv("RENDER_EXTERNAL_URL")
        or os.getenv("RENDER_EXTERNAL_HOSTNAME")
    )
    if backend_url:
        parsed = urlparse(backend_url if "://" in backend_url else f"https://{backend_url}")
        return (parsed.netloc or parsed.path).strip("/")

    allowed_hosts = [
        host.strip()
        for host in os.getenv("ALLOWED_HOSTS", "").split(",")
        if host.strip() and host.strip() not in {"*", "localhost", "127.0.0.1"}
    ]
    if allowed_hosts:
        return allowed_hosts[0]

    return "localhost"


def _is_production():
    domain = _site_domain()
    return (
        not _is_truthy(os.getenv("DEBUG"))
        and domain not in {"localhost", "127.0.0.1"}
    )


def _redacted_configured(value):
    return "configured" if value else "missing"


def _google_app(name, client_id, secret):
    app = SocialApp.objects.filter(provider="google", name=name).first()
    if app:
        return app, False

    app = SocialApp.objects.filter(provider="google").first()
    if app:
        return app, False

    return SocialApp.objects.create(
        provider="google",
        name=name,
        client_id=client_id,
        secret=secret,
    ), True


def _sync_site(site, domain, production):
    if production and domain not in {"localhost", "127.0.0.1"}:
        if site.domain != domain or site.name != domain:
            site.domain = domain
            site.name = domain
            site.save()
            return True

    if site.domain in {"example.com", "localhost"} or site.name in {"example.com", "localhost"}:
        site.domain = domain
        site.name = domain
        site.save()
        return True

    return False


class Command(BaseCommand):
    help = "Idempotently setup Django Site and Google OAuth SocialApp using environment variables"

    def handle(self, *args, **options):
        production = _is_production()
        domain = _site_domain()
        config = GOOGLE_PROVIDER

        site, created = Site.objects.get_or_create(
            id=1,
            defaults={
                "domain": domain,
                "name": domain,
            },
        )

        site_updated = _sync_site(site, domain, production)

        if created:
            self.stdout.write(self.style.SUCCESS(f"Created default Site (id=1, domain={site.domain})"))
        elif site_updated:
            self.stdout.write(self.style.SUCCESS(f"Updated Site (id=1, domain={site.domain})"))
        else:
            self.stdout.write(self.style.SUCCESS(f"Default Site configured (id=1, domain={site.domain})"))

        client_id = os.getenv(config["client_id_env"])
        secret = os.getenv(config["secret_env"])

        self.stdout.write(
            f"google credentials: "
            f"{config['client_id_env']}={_redacted_configured(client_id)}, "
            f"{config['secret_env']}={_redacted_configured(secret)}"
        )

        if not client_id or not secret:
            message = (
                f"{config['client_id_env']} and {config['secret_env']} are required "
                f"to configure Google OAuth."
            )
            if production:
                raise ImproperlyConfigured(message)
            self.stdout.write(self.style.WARNING(message))
            return

        app, app_created = _google_app(
            name=config["name"],
            client_id=client_id,
            secret=secret,
        )

        app.name = config["name"]
        app.client_id = client_id
        app.secret = secret
        app.save()

        if site not in app.sites.all():
            app.sites.add(site)

        status_str = "created" if app_created else "updated"
        self.stdout.write(
            self.style.SUCCESS(
                f"Google SocialApp {status_str} and associated with Site id=1."
            )
        )
