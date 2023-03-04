import boto3
from botocore.exceptions import ClientError
import json
from json2html import *

class email_notification:
    def send_email(SENDER, RECIPIENTS, info):
        AWS_REGION = "ap-south-1"
        SUBJECT = "Testing mail please Ignore"
        BODY_TEXT = ("Please find the information {}".format(info))
        BODY_HTML = str(json2html.convert(info))
        print(BODY_HTML)
        # The character encoding for the email.
        CHARSET = "UTF-8"
        # Create a new SES resource and specify a region.
        client = boto3.client('ses',region_name=AWS_REGION)
        # Try to send the email.
        try:
            # Provide the contents of the email.
            destination = {'ToAddresses': [RECIPIENTS[0]]}
            if len(RECIPIENTS) > 1:
                destination['BccAddresses'] = RECIPIENTS[1:]
            response = client.send_email(
                Destination=destination,
                Message={
                    'Body': {
                        'Html': {
                            'Charset': CHARSET,
                            'Data': BODY_HTML,
                        },
                        'Text': {
                            'Charset': CHARSET,
                            'Data': BODY_TEXT,
                        },
                    },
                    'Subject': {
                        'Charset': CHARSET,
                        'Data': SUBJECT,
                    },
                },
                Source=SENDER,
            )
        # Display an error if something goes wrong.	
        except ClientError as e:
            print(e.response['Error']['Message'])
        else:
            print("Email sent! Message ID:"),
            return "success"
