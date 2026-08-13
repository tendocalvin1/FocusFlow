from django.conf import settings
from django.core.management.base import BaseCommand
from django.contrib.sites.models import Site
from allauth.socialaccount.models import SocialApp
import os


class Command(BaseCommand):
    help = "Print safe OAuth configuration diagnostics without exposing secrets"

    def handle(self, *args, **options):
        self.stdout.write("Environment:")
        for name in (
            "DATABASE_URL",
            "SECRET_KEY",
            "DEBUG",
            "FRONTEND_URL",
            "GOOGLE_CLIENT_ID",
            "GOOGLE_CLIENT_SECRET",
            "GITHUB_CLIENT_ID",
            "GITHUB_CLIENT_SECRET",
        ):
            self.stdout.write(f"  {name} = {'configured' if os.getenv(name) else 'missing'}")

        self.stdout.write("")
        self.stdout.write(f"SITE_ID = {settings.SITE_ID}")
        self.stdout.write("Sites:")
        for site in Site.objects.order_by("id"):
            self.stdout.write(f"  id={site.id} domain={site.domain} name={site.name}")

        self.stdout.write("")
        self.stdout.write("SocialApps:")
        for app in SocialApp.objects.order_by("provider", "id"):
            sites = ", ".join(site.domain for site in app.sites.order_by("id")) or "none"
            self.stdout.write(
                "  "
                f"provider={app.provider} "
                f"name={app.name} "
                f"client_id={'configured' if app.client_id else 'missing'} "
                f"secret={'configured' if app.secret else 'missing'} "
                f"sites=[{sites}]"
            )
