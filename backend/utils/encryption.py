# backend/utils/encryption.py
import os
import base64
import hashlib
from cryptography.fernet import Fernet
from config import settings

class DataEncryptor:
    def __init__(self):
        key = os.environ.get("ENCRYPTION_KEY")
        if not key:
            # Derive deterministic key from backend API_SECRET_KEY
            derived = hashlib.sha256(settings.API_SECRET_KEY.encode()).digest()
            key = base64.urlsafe_b64encode(derived).decode()
        self.cipher = Fernet(key.encode() if isinstance(key, str) else key)

    def encrypt(self, plain_text: str) -> str:
        """Encrypt plain text to base64 Fernet token."""
        if not plain_text:
            return ""
        return self.cipher.encrypt(plain_text.encode("utf-8")).decode("utf-8")

    def decrypt(self, cipher_text: str) -> str:
        """Decrypt Fernet token back to plain text."""
        if not cipher_text:
            return ""
        try:
            return self.cipher.decrypt(cipher_text.encode("utf-8")).decode("utf-8")
        except Exception:
            return cipher_text

encryptor = DataEncryptor()
