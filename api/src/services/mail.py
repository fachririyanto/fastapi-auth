import smtplib

from email.message import EmailMessage

from src.config import app_config


class Mail:
    sender: str
    to: str
    subject: str
    message: str

    def __init__(self, sender: str, to: str, subject: str, message: str):
        self.sender = sender
        self.to = to
        self.subject = subject
        self.message = message

    def send(self):
        try:
            msg = EmailMessage()
            msg.add_alternative(self.message, subtype="html")
            msg["From"] = self.sender
            msg["To"] = self.to
            msg["Subject"] = self.subject

            with smtplib.SMTP_SSL(app_config.SMTP_HOST, app_config.SMTP_PORT) as server:
                server.login(user=app_config.SMTP_USER, password=app_config.SMTP_PASSWORD)
                server.send_message(msg=msg)
        except smtplib.SMTPException as e:
            raise e
