from django.core.management.base import BaseCommand
from django.contrib.sites.models import Site
from allauth.socialaccount.models import SocialApp
import os

class Command(BaseCommand):
    help = "Idempotently setup Django Site and OAuth SocialApps using environment variables"

    def handle(self, *args, **options):
        # 1. Site configuration
        site, created = Site.objects.get_or_create(
            id=1,
            defaults={
                "domain": "localhost",
                "name": "localhost",
            }
        )
        if not created and (site.domain == "example.com" or site.name == "example.com"):
            site.domain = "localhost"
            site.name = "localhost"
            site.save()

        if created:
            self.stdout.write(self.style.SUCCESS(f"Created default Site (id=1, domain={site.domain})"))
        else:
            self.stdout.write(self.style.SUCCESS(f"Default Site configured (id=1, domain={site.domain})"))

        # 2. Google SocialApp configuration
        google_client_id = os.getenv("GOOGLE_CLIENT_ID")
        google_client_secret = os.getenv("GOOGLE_CLIENT_SECRET")

        if google_client_id and google_client_secret:
            google_app, app_created = SocialApp.objects.get_or_create(
                provider="google",
                defaults={
                    "name": "FocusFlow Google",
                    "client_id": google_client_id,
                    "secret": google_client_secret,
                }
            )
            if not app_created:
                google_app.name = "FocusFlow Google"
                google_app.client_id = google_client_id
                google_app.secret = google_client_secret
                google_app.save()

            if site not in google_app.sites.all():
                google_app.sites.add(site)

            status_str = "created" if app_created else "updated"
            self.stdout.write(self.style.SUCCESS(f"Google SocialApp {status_str} and associated with Site id=1."))
        else:
            self.stdout.write(self.style.WARNING("GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET missing from environment. Skipping Google SocialApp setup."))

        # 3. GitHub SocialApp configuration (optional)
        github_client_id = os.getenv("GITHUB_CLIENT_ID")
        github_client_secret = os.getenv("GITHUB_CLIENT_SECRET")

        if github_client_id and github_client_secret:
            github_app, app_created = SocialApp.objects.get_or_create(
                provider="github",
                defaults={
                    "name": "FocusFlow GitHub",
                    "client_id": github_client_id,
                    "secret": github_client_secret,
                }
            )
            if not app_created:
                github_app.name = "FocusFlow GitHub"
                github_app.client_id = github_client_id
                github_app.secret = github_client_secret
                github_app.save()

            if site not in github_app.sites.all():
                github_app.sites.add(site)

            status_str = "created" if app_created else "updated"
            self.stdout.write(self.style.SUCCESS(f"GitHub SocialApp {status_str} and associated with Site id=1."))
        else:
            self.stdout.write(self.style.NOTICE("GitHub OAuth credentials not found in environment. Provider installed."))
