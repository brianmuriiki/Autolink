from apps.platforms.models import ConnectedAccount


def connect_platform(user, **data):
    return ConnectedAccount.objects.create(user=user, **data)


def disconnect_platform(account):
    account.is_active = False
    account.save(update_fields=["is_active", "updated_at"])
    return account


def refresh_tokens(account, token, refresh_token="", expires_at=None):
    account.token = token
    if refresh_token:
        account.refresh_token = refresh_token
    account.token_expires_at = expires_at
    account.save(update_fields=["token", "refresh_token", "token_expires_at", "updated_at"])
    return account

