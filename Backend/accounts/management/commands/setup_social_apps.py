from django.core.management.base import BaseCommand
from django.core.exceptions import ImproperlyConfigured
from django.contrib.sites.models import Site
from allauth.socialaccount.models import SocialApp
import os
from urllib.parse import urlparse


PROVIDERS = {
    "google": {
        "name": "FocusFlow Google",
        "client_id_env": "GOOGLE_CLIENT_ID",
        "secret_env": "GOOGLE_CLIENT_SECRET",
        "required": True,
    },
    "github": {
        "name": "FocusFlow GitHub",
        "client_id_env": "GITHUB_CLIENT_ID",
        "secret_env": "GITHUB_CLIENT_SECRET",
        "required": True,
    },
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


def _provider_app(provider, name, client_id, secret):
    app = SocialApp.objects.filter(provider=provider, name=name).first()
    if app:
        return app, False

    app = SocialApp.objects.filter(provider=provider).first()
    if app:
        return app, False

    return SocialApp.objects.create(
        provider=provider,
        name=name,
        client_id=client_id,
        secret=secret,
    ), True


class Command(BaseCommand):
    help = "Idempotently setup Django Site and OAuth SocialApps using environment variables"

    def handle(self, *args, **options):
        production = _is_production()
        domain = _site_domain()

        site, created = Site.objects.get_or_create(
            id=1,
            defaults={
                "domain": domain,
                "name": domain,
            }
        )

        if site.domain in {"example.com", "localhost"} or site.name in {"example.com", "localhost"}:
            site.domain = domain
            site.name = domain
            site.save()

        if created:
            self.stdout.write(self.style.SUCCESS(f"Created default Site (id=1, domain={site.domain})"))
        else:
            self.stdout.write(self.style.SUCCESS(f"Default Site configured (id=1, domain={site.domain})"))

        for provider, config in PROVIDERS.items():
            client_id = os.getenv(config["client_id_env"])
            secret = os.getenv(config["secret_env"])

            self.stdout.write(
                f"{provider} credentials: "
                f"{config['client_id_env']}={_redacted_configured(client_id)}, "
                f"{config['secret_env']}={_redacted_configured(secret)}"
            )

            if not client_id or not secret:
                message = (
                    f"{config['client_id_env']} and {config['secret_env']} are required "
                    f"to configure {provider} OAuth."
                )
                if production and config["required"]:
                    raise ImproperlyConfigured(message)
                self.stdout.write(self.style.WARNING(message))
                continue

            app, app_created = _provider_app(
                provider=provider,
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
                    f"{provider.title()} SocialApp {status_str} and associated with Site id=1."
                )
            )
