import smtplib
import ssl
from email.message import EmailMessage
import json
from json2html import *

def send_email(sender,receiver_list,password, body,  report_name):
    l=receiver_list
    #l=['ratik.khanna@dhiomics.com']
    for i in l:
        email_sender = sender #'scrappertmw.123@gmail.com'
        email_password = password #'eygrhklhidizmozc'
        email_receiver = i
        BODY_HTML = str(json2html.convert(body))
        # Set the subject and body of the email
        subject = report_name #'QC Report2'
        body = BODY_HTML
        
        em = EmailMessage()
        em['From'] = email_sender
        em['To'] = email_receiver
        em['Subject'] = subject
        em.set_content(body)
        em.set_content(body, 'text/html')
        em.add_alternative(BODY_HTML, subtype='html')

        # Add SSL (layer of security)
        context = ssl.create_default_context()

        # Log in and send the email
        with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as smtp:
            smtp.login(email_sender, email_password)
            smtp.sendmail(email_sender, email_receiver, em.as_string())