import pandas as pd
import pyodbc 
import mysql.connector as msc
import io
from io import BytesIO
from google.cloud import storage
import boto3
import json

class utility:
    def bucket(credentials_dict, bucket_name, file_name_path_or_object_key, cloud_name):
        if cloud_name.lower()=="gcp":
            storage_client = storage.Client.from_service_account_info(credentials_dict)
            BUCKET_NAME = bucket_name
            bucket = storage_client.get_bucket(BUCKET_NAME)
            filename = list(bucket.list_blobs(prefix=''))
            for name in filename:
                print(name.name)
            blob = bucket.blob(file_name_path_or_object_key)
            data = blob.download_as_string()
            df = pd.read_csv(io.BytesIO(data), encoding="utf-8", sep=",")
            return df
        elif cloud_name.lower()=="aws":
            json_file = credentials_dict
            aws_access_key_id = json_file['aws_access_key_id']
            aws_secret_access_key = json_file['aws_secret_access_key']
            s3 = boto3.client('s3', aws_access_key_id=aws_access_key_id, aws_secret_access_key=aws_secret_access_key)
            bucket_name = bucket_name
            object_key = file_name_path_or_object_key
            response = s3.get_object(Bucket=bucket_name, Key=object_key)
            df = pd.read_csv(response['Body'])
            return df 


# with open(r"C:\Users\User\Desktop\DQM\Data_Quality\credentials-python-storage.json") as f:
#     json_file = json.load(f)
# print(json_file)
# df = utility.bucket(json_file,"tmrw_scraping_data","pdp/ajio/2023/01/14/PDP_Ajio_2023_01_13_PDP_Batch 8_500_Products20230113.csv","gcp")
# print(df)