from flask import Flask, request, render_template
import pandas as pd
import json
from flask_cors import CORS 
from validation_email import email_notification
from smtp import send_email
from validations import validations
import re
import os
from utility import utility

app = Flask(__name__, static_folder='./', static_url_path='/')
CORS(app)
current_dir = os.getcwd()
temp_path = f"{current_dir}\\TEMP"
static_list = ["expect_column_values_to_be_between",
               "expect_column_values_to_not_be_in_set",
               "expect_column_values_to_be_in_set",
               "expect_column_values_to_be_in_type_list",
               "expect_column_values_to_be_of_type",
               "expect_column_values_to_be_null",
               "expect_column_values_to_not_be_null",
               "expect_column_values_to_be_unique",]



def clean_str(string):
    string_1 = re.sub(r'\{|\}', '', string)
    string_2 = re.sub(r'"', '', string_1)
    string_3 = string_2.split(",")[1:]
    string_4 = [i.split(":")[1] for i in string_3]
    return string_4

def table_maker(dictionary):
    if len(dictionary)==0:
        return pd.DataFrame()
    exp=[]
    par=[]
    for key1, val1 in dictionary.items():
        if type(dictionary[key1])==dict:
            for key2, val2 in dictionary[key1].items():
                exp.append(key2)
                par.append(val2)
        else:
            exp.append(key1)
            par.append(val1)
    return pd.DataFrame({"expectation":exp,"parameter":par})


@app.route('/')
def hello_world():
    return app.send_static_file('Index.html')

    
@app.route('/route_to_next',methods=['POST','GET'])
def route():
    source_name = request.args['id']
    print("source_name=====",source_name)
    try:
        return app.send_static_file(source_name+".html")
    except:
        return "Your not selected correct option"
 
@app.route('/upload', methods=['POST','GET'])
def upload_func():
    file = request.files['file']
    delimeter=request.form["delimeter"]
    print("fildaata",file)
    print("delimeter=",delimeter)
    global df 
    if delimeter == '':
        df = pd.read_csv(file,encoding='latin1')
    else:
        df = pd.read_csv(file,encoding='latin1',delimiter=delimeter)
    
    lst1 = list(df.columns)
    lst2 = static_list
    json_dict = {col: lst2 for col in lst1}
    json_data = json.dumps(json_dict)
    print(json_data)
    return {"success":True,"tableData":json_data}

#Taking credentials from AWS page
@app.route('/aws_crud',methods=['GET','POST'])
def aws_crud():


    aws_credentials=request.form.get("aws_credentials")
    json_file = request.files['file']
    result_list = clean_str(aws_credentials)
     
    json_data = json.load(json_file)
    bucket_name = result_list[0] #tmrw_scraping_data
    file_path_name = result_list[1] #pdp/ajio/2023/01/14/PDP_Ajio_2023_01_13_PDP_Batch 8_500_Products20230113.csv
    print("AWS_credintials==",json_file)

    print("Bucket Name:",bucket_name)
    print("FIle Path Name:",file_path_name)
    print("json file:", json_data)
    print("################")
    global df
    df=pd.read_csv("plp.csv", encoding='latin1')
    # df = utility.bucket(json_data,bucket_name,file_path_name,"gcp")
    lst1=list(df.columns)
    lst2 = static_list
    json_dict = {col: lst2 for col in lst1}
    json_data = json.dumps(json_dict)
    # print("JSON DATA", json_data)
    return {"success":True,"tableData":json_data}

    # json_data = pd.read_json(json_file, orient='index')
    # json_data.to_json(f"{temp_path}\\aws_cred.json")
    # bucket_name = result_list[0]
    # file_path_name = result_list[1]
    
    # df = utility.bucket(json_file,"tmrw_scraping_data","pdp/ajio/2023/01/14/PDP_Ajio_2023_01_13_PDP_Batch 8_500_Products20230113.csv","aws")
    # with open('yathish.json', 'w') as json_file:
    #     json.dump(fileData, json_file)
    
    # new_json=json.loads(aws_credentials)
    # print("file==",file)
    # print("new_json",new_json)
    # print("file_name==",file)
    # print("aws_credintials==",new_json["File_name"])
    # print("Json_File=======",new_json)
    # return "success"

    # aws_file=pd.read_csv("plp.csv", encoding='latin1')
    # lst1=list(aws_file.columns)
    # lst2 = static_list
    # json_dict = {col: lst2 for col in lst1}
    # json_data = json.dumps(json_dict)
    # print("JSON DATA", json_data)
    # return {"success":True,"tableData":"json_data"}

#Taking input from aws_greatExpectation table and showing data
@app.route('/aws_sendExpectation', methods=['GET','POST'])
def aws_sendExpectation():
    data = request.data
    print("json_data_aws==",data)
  
    return "hello"

#starting Great expectation 


#Taking credentials from AWS page
@app.route('/gcp_crud',methods=['GET','POST'])
def gcp_crud():
    # file = request.files['file']
    gcp_credentials=request.form.get("gcp_credentials")
    json_file = request.files['file']
    result_list = clean_str(gcp_credentials)

    json_data = json.load(json_file)
    bucket_name = result_list[0] #tmrw_scraping_data
    file_path_name = result_list[1] #pdp/ajio/2023/01/14/PDP_Ajio_2023_01_13_PDP_Batch 8_500_Products20230113.csv
    print("Bucket Name:",bucket_name)
    print("FIle Path Name:",file_path_name)
    print("json file:", json_data)
    print("GCP_credintials==",json_file)
    global df
    # df=pd.read_csv("plp.csv", encoding='latin1')
    df = utility.bucket(json_data,bucket_name,file_path_name,"gcp")
    lst1=list(df.columns)
    lst2 = static_list
    json_dict = {col: lst2 for col in lst1}
    json_data = json.dumps(json_dict)
    # print("JSON DATA", json_data)
    return {"success":True,"tableData":json_data}

#Taking input from aws_greatExpectation table and showing data
@app.route('/gcp_sendExpectation', methods=['GET','POST'])
def gcp_sendExpectation():
    data = request.data
    print("json_data_gcp==",data)
  
    return "hello"

 
#Ending file 

#Sending succes status to fronted when get the data in file uploading 
@app.route('/getData', methods=['GET'])
def get():
        return {"success":True,"tableData":"got the data"}

#Taking value and what the user selected from user in  Greate expectation table 
@app.route('/file_GE', methods=['GET','POST'])
def file_GE():
    global df
    data = request.data
    str_data = data.decode('utf-8')
    dict_data = json.loads(str_data)
    print("\n")
    print("\n")
    exp1 = dict(dict_data['test']["UniqueExpectations"])
    exp1 =  {key:val for key, val in exp1.items() if len(exp1[key])>0}
    exp2 = dict(dict_data["test"]["CommonExpectationsData"])
    exp_df1 = table_maker(exp1)
    exp_df2 = table_maker(exp2)
    exp_df_main = pd.concat([exp_df1,exp_df2],axis=0).reset_index(drop=True)
    # exp_df_main.drop(columns=["Unnamed: 0"], inplace=True)
    # df.to_csv(f"{temp_path}\\act_df.csv")
    # exp_df_main.to_csv(f"{temp_path}\\exp_df.csv")
    print("main df:")
    print("\n")
    print("\n")
    print(df)
    print("\n")
    print("\n")
    print("Exp df:")
    print("\n")
    print("\n")
    print(exp_df_main)
    print("\n")
    print("\n")
    # return {"success":True}
    global result
    result = validations.ge_validations(df, exp_df_main)
    print("Result:",result)
    return app.send_static_file("mailer.html")

@app.route("/mail_crud",methods=['GET','POST'])
def mailer():
    data=json.loads(request.data)
    print(data,"********")
    sender = data["sender_name"]
    receiver = data["receiver_mail"]
    receivers = receiver.split(",")
    email_notification.send_email(sender,receivers,result)
    return {"success":True}




if __name__ == '__main__':
   app.run(debug=True, host='0.0.0.0')