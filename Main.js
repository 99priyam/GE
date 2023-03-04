function RouteToNext(event)
{
    console.log("calleld lelvent")
    console.log("event===",event.target.id)
    if(event.target.id == 'Great_Expectation_Table'){
        aws_tableData()
    }
    else if(event.target.id == 'mailer'){
       aws_tableData()
    //   alert("called next")
    }
    window.location.href="http://127.0.0.1:5000/route_to_next?id=" + event.target.id ;

}

// function sendExpectationList () {
//     const final1 = {}
//     const kk = localStorage.getItem("file");
//     console.log(JSON.parse(kk))
//     let tableData = JSON.parse(kk);
//     let commonExpectationTableData = ["expect_column_to_exist",

//         "expect_table_columns_to_match_ordered_list",

//         "expect_table_columns_to_match_set",

//         "expect_table_row_count_to_be_between",

//         "expect_table_row_count_to_equal",

//         "expect_table_row_count_to_equal_other_table"]

//     final1["UniqueExpectations"] = {}

//     Object.keys(tableData).forEach((col) => {
//         final1["UniqueExpectations"][col] = {};
//         tableData[col].forEach(val => {
//             if (document.getElementById(col.toLowerCase() + "-" + val.toLowerCase() + "-checkbox").checked) {
//                 final1["UniqueExpectations"][col][val] = document.getElementById(col.toLowerCase() + "-" + val.toLowerCase()).value
//             }
//         })
//     })



//     final1["CommonExpectationsData"] = {};
//     commonExpectationTableData.forEach((col) => {
//             if (document.getElementById(col.toLowerCase() + "-checkbox").checked) {
//                 final1["CommonExpectationsData"][col] = document.getElementById(col).value
//             }
//     })



//     console.log("final1==============:", final1)
//     const url = "http://localhost:5000/file_GE"
//     fetch(url, { method: 'POST', body: JSON.stringify({"test": final1}) }).then((response) => {
//         console.log(response)
//     })
//     alert("send successfully");
//     // Result_page();
//     RouteToNext({target:{id:"mailer"}});
// }


// Taking data from dataframe to show in the final page data dynamically. This will operate in upload file

async function getData  () {
    localStorage.removeItem('file');
    const fileData = document.getElementById("file").files[0];
    const delimeter=document.getElementById("sep").value
    // const demieter_value={"delimeter":delimeter}
    console.log("FFFFFF",fileData);
    const formData = new FormData()
    formData && formData.append('file', fileData)
    formData && formData.append('delimeter',delimeter)
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var res = xhttp.responseText;
            let response = JSON.parse(res)
            console.log(JSON.parse(response.tableData));
            localStorage.setItem("file", (response.tableData))
            document.getElementById("Great_Expectation_Table").style.display = "block";
            alert("Uploaded Successfully.")
        } else if (this.readyState == 4 && (this.status == 404 || this.status == 500 || this.status == 303)) {
            alert("Error With the Data.")
        }
    };
    xhttp.open("POST", "http://127.0.0.1:5000/upload", true);
    xhttp.send(formData);
}




// Taking dynamically data from the server in final page:
function tableData() {
    const kk = localStorage.getItem("file");
    // console.log(JSON.parse(kk))
    let tableData = JSON.parse(kk);



    let MainHeaderColumns = ''
    let SubHeaderColumns = ''
    let tempArray = []

    //   console.log(Object.keys(tableData))
    Object.keys(tableData).map((eachCol, colIndex) => {
        tempArray.push(tableData[eachCol].length)
        MainHeaderColumns += `
      <th colspan="3" class="text-center" >${eachCol}</th>
      `
        SubHeaderColumns += `
    <th class="text-center">Requirred</th>
      <th class="text-center">Expectations</th>
      <th class="text-center">Value</th>
      `
    })

    let maxSize = Math.max(...tempArray)
    let TableRows = ""

    for (let i = 0; i < maxSize; i++) {
        TableRows += `<tr>`
        Object.keys(tableData).map((eachCol, colIndex) => {
            let id = eachCol.toLowerCase() + '-' + tableData[eachCol][i];
            TableRows += `<td> <input type="checkbox" id="${id + "-checkbox"}" /> </td><td>${tableData[eachCol][i]}</td><td><input id="${id}" type="text"/></td>`

        })
        TableRows += `</tr>`

        document.getElementById("tbody").innerHTML = TableRows;

    }


    let CommonExpectationsData = "";
    ["expect_column_to_exist",

        "expect_table_columns_to_match_ordered_list",

        "expect_table_columns_to_match_set",

        "expect_table_row_count_to_be_between",

        "expect_table_row_count_to_equal",

        "expect_table_row_count_to_equal_other_table"].map((eachExpe, expIndex) => {
            CommonExpectationsData += `
    <tr>
    <td>
        <label for=${eachExpe}></label>
        <input type="checkbox" id="${eachExpe + "-checkbox"}" >
    </td>
    <td>${eachExpe}
    <td> <input type="text" id=${eachExpe} ></td>
  </tr>
    `
        })
    document.getElementById("CommonExpectationsTableBody").innerHTML = CommonExpectationsData;

    document.getElementById('MainColumns').innerHTML = MainHeaderColumns
    document.getElementById('SubColumns').innerHTML = SubHeaderColumns

}

//Sending AWS credintials to backend

function aws_crud(){
    localStorage.removeItem('file');
    const File=document.getElementById("aws_file").files[0]
    const file_name = document.getElementById("aws_file").files[0]["name"];
    const bucket_name=document.getElementById("aws_bucket_name").value;
    const file_path=document.getElementById("aws_file_path").value;
    const aws_credentials={"File_name": file_name,"Bucket_name":bucket_name,"File_path":file_path}
    
    // console.log(gcp_credentials)
    const formData=new FormData()
    formData.append("aws_credentials",JSON.stringify(aws_credentials))  
    formData.append("file",File)

    console.log(formData,formData.get("aws_credentials"))

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {
            // document.getElementById("Gcp_Great_Expectation_table").style.display = "block";

            
            var res = xhttp.responseText;
            let response = JSON.parse(res)
            if(response?.success){
                localStorage.setItem("file", (response.tableData))
                alert("Uploaded Successfully.")
            const jsondata = {
                target : {
                    id : "Great_Expectation_Table"
                }
            }
            RouteToNext(jsondata)
            aws_tableData()

        } else {
            alert("Please enter valid credentials and try again")
        }




            // alert("Uploaded Successfully.")
        } else if (this.readyState == 4 && (this.status == 404 || this.status == 500 || this.status == 303)) {
            alert("Error With the Data.")
        }
    };
    
    xhttp.open("POST", "http://127.0.0.1:5000/aws_crud", true);
    xhttp.send(formData);
    // Result_page();
    }
//********************



// function aws_crud(){
//     localStorage.removeItem('file');
//     const File=document.getElementById("aws_file").files[0]
//     const file_name = document.getElementById("aws_file").files[0]["name"];
//     const bucket_name=document.getElementById("aws_bucket_name").value;
//     const file_path=document.getElementById("aws_file_path").value;
//     const aws_credentials={"File_name": file_name,"Bucket_name":bucket_name,"File_path":file_path}
    
//     console.log(aws_credentials)
//     const formData=new FormData()
//     formData.append("aws_credentials",JSON.stringify(aws_credentials))  
//     formData.append("file",File)

//     console.log(formData,formData.get("aws_credentials"))


    
//     var xhttp = new XMLHttpRequest();
//     xhttp.onreadystatechange = function () {

//         if (this.readyState == 4 && this.status == 200) {
            
//             var res = xhttp.responseText;
//             let response = JSON.parse(res)
//             if(response?.success){
//                 localStorage.setItem("file", (response.tableData))
//                 alert("Uploaded Successfully.")
//             const jsondata = {
//                 target : {
//                     id : "Great_Expectation_Table"
//                 }
//             }
//             RouteToNext(jsondata)
//             aws_tableData()

//             } else {
//                 alert("incorrect credentials.\nPlease check the credentials you entered and try again!")
//             }
//             document.getElementById("Great_Expectation_Table").style.display = "block";
//         } else if (this.readyState == 4 && (this.status == 404 || this.status == 500 || this.status == 303)) {
//             alert("Error With the Data.")
//         }
//     };
    
//     xhttp.open("POST", "http://127.0.0.1:5000/aws_crud", true);
//     xhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
//     xhttp.send(formData);
//     // Result_page();
//     }

//************************* *


//Calling api because taking file from flask api

function aws_tableData() {
        var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var res = xhttp.responseText;
            let response = JSON.parse(res)
            console.log(JSON.parse(response.tableData));
            localStorage.setItem("aws_file", (response.tableData))
            renderTableData()
        } else if (this.readyState == 4 && (this.status == 404 || this.status == 500 || this.status == 303)) {
            alert("Error With the Data.")
        }
    };

        xhttp.open("POST", "http://127.0.0.1:5000/aws_GE", true);
        xhttp.send({});

    }

//If the response true in aws_tableData it will call

    function renderTableData (){
        const tableData = JSON.parse(localStorage.getItem('file'));
        let MainHeaderColumns = ''
        let SubHeaderColumns = ''
        let tempArray = []

        Object.keys(tableData).forEach((eachCol, colIndex) => {
            tempArray.push(tableData[eachCol].length)
            MainHeaderColumns += `<th colspan="3" class="text-center" >${eachCol}</th>`
            SubHeaderColumns += `<th class="text-center">Requirred</th>
                <th class="text-center">Expectations</th>
                <th class="text-center">Value</th>`
        });

        let maxSize = Math.max(...tempArray)
        let TableRows = ""
    
        for (let i = 0; i < maxSize; i++) {
            TableRows += `<tr>`
            Object.keys(tableData).map((eachCol, colIndex) => {
                let id = eachCol.toLowerCase() + '-' + tableData[eachCol][i];
                TableRows += `<td> <input type="checkbox" id="${id + "-checkbox"}" /> </td><td>${tableData[eachCol][i]}</td><td><input id="${id}" type="text"/></td>`
    
            })
            TableRows += `</tr>`
    
            document.getElementById("tbody").innerHTML = TableRows;
    
        }

            let CommonExpectationsData = "";
        ["expect_column_to_exist",
    
            "expect_table_columns_to_match_ordered_list",
    
            "expect_table_columns_to_match_set",
    
            "expect_table_row_count_to_be_between",
    
            "expect_table_row_count_to_equal",
    
            "expect_table_row_count_to_equal_other_table"].map((eachExpe, expIndex) => {
                CommonExpectationsData += `
        <tr>
        <td>
            <label for=${eachExpe}></label>
            <input type="checkbox" id="${eachExpe + "-checkbox"}" >
        </td>
        <td>${eachExpe}
        <td> <input type="text" id=${eachExpe} ></td>
      </tr>
        `
            })

            document.getElementById("CommonExpectationsTableBody").innerHTML = CommonExpectationsData;
    
                document.getElementById('MainColumns').innerHTML = MainHeaderColumns
                document.getElementById('SubColumns').innerHTML = SubHeaderColumns
    }
 
//Sending user printabel value to flask api 

    // const aws_sendExpectationList = () => {
    //     const final1 = {}
    //     const kk = localStorage.getItem("file");
    //     localStorage.removeItem('file');

    //     console.log(JSON.parse(kk))
    //     let tableData = JSON.parse(kk);
    //     let commonExpectationTableData = ["expect_column_to_exist",
    
    //         "expect_table_columns_to_match_ordered_list",
    
    //         "expect_table_columns_to_match_set",
    
    //         "expect_table_row_count_to_be_between",
    
    //         "expect_table_row_count_to_equal",
    
    //         "expect_table_row_count_to_equal_other_table"]
    
    //     final1["UniqueExpectations"] = {}
    
    //     Object.keys(tableData).forEach((col) => {
    //         final1["UniqueExpectations"][col] = {};
    //         tableData[col].forEach(val => {
    //             if (document.getElementById(col.toLowerCase() + "-" + val.toLowerCase() + "-checkbox").checked) {
    //                 final1["UniqueExpectations"][col][val] = document.getElementById(col.toLowerCase() + "-" + val.toLowerCase()).value
    //             }
    //         })
    //     })
    
    
    
    //     final1["CommonExpectationsData"] = {};
    //     commonExpectationTableData.forEach((col) => {
    //             if (document.getElementById(col.toLowerCase() + "-checkbox").checked) {
    //                 final1["CommonExpectationsData"][col] = document.getElementById(col).value
    //             }
    //     })
    
    
    
    //     console.log("final1==============:", final1)
    //     const url = "http://localhost:5000/aws_sendExpectation"
    //     fetch(url, { method: 'POST', body: JSON.stringify({"test": final1}) }).then((response) => {
    //         console.log(response)
    //     })
    //     alert("send successfully");
    
    // }

//Complete GCP code

function gcp_crud(){
    localStorage.removeItem('file');
    const File=document.getElementById("gcp_file").files[0]
    const file_name = document.getElementById("gcp_file").files[0]["name"];
    const bucket_name=document.getElementById("Gcp_bucket_name").value;
    const file_path=document.getElementById("Gcp_FilePath").value;
    const gcp_credentials={"File_name": file_name,"Bucket_name":bucket_name,"File_path":file_path}
    
    // console.log(gcp_credentials)
    const formData=new FormData()
    formData.append("gcp_credentials",JSON.stringify(gcp_credentials))  
    formData.append("file",File)

    console.log(formData,formData.get("gcp_credentials"))

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {
            // document.getElementById("Gcp_Great_Expectation_table").style.display = "block";

            
            var res = xhttp.responseText;
            let response = JSON.parse(res)
            if(response?.success){
                localStorage.setItem("file", (response.tableData))
                alert("Uploaded Successfully.")
            const jsondata = {
                target : {
                    id : "Great_Expectation_Table"
                }
            }
            RouteToNext(jsondata)
            aws_tableData()

        } else {
            alert("Please enter valid credentials and try again")
        }




            // alert("Uploaded Successfully.")
        } else if (this.readyState == 4 && (this.status == 404 || this.status == 500 || this.status == 303)) {
            alert("Error With the Data.")
        }
    };
    
    xhttp.open("POST", "http://127.0.0.1:5000/gcp_crud", true);
    xhttp.send(formData);
    // Result_page();
    }




//Calling api because taking file from flask api

function gcp_tableData() {
        var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var res = xhttp.responseText;
            let response = JSON.parse(res)
            console.log(JSON.parse(response.tableData));
            localStorage.setItem("gcp_file", (response.tableData))
            gcp_renderTableData()
        } else if (this.readyState == 4 && (this.status == 404 || this.status == 500 || this.status == 303)) {
            alert("Error With the Data.")
        }
    };

        xhttp.open("POST", "http://127.0.0.1:5000/gcp_GE", true);
        xhttp.send({});

    }

//If the response true in aws_tableData it will call

    const gcp_renderTableData = () => {
        const tableData = JSON.parse(localStorage.getItem('file'));
        let MainHeaderColumns = ''
        let SubHeaderColumns = ''
        let tempArray = []

        Object.keys(tableData).forEach((eachCol, colIndex) => {
            tempArray.push(tableData[eachCol].length)
            MainHeaderColumns += `<th colspan="3" class="text-center" >${eachCol}</th>`
            SubHeaderColumns += `<th class="text-center">Requirred</th>
                <th class="text-center">Expectations</th>
                <th class="text-center">Value</th>`
        });

        let maxSize = Math.max(...tempArray)
        let TableRows = ""
    
        for (let i = 0; i < maxSize; i++) {
            TableRows += `<tr>`
            Object.keys(tableData).map((eachCol, colIndex) => {
                let id = eachCol.toLowerCase() + '-' + tableData[eachCol][i];
                TableRows += `<td> <input type="checkbox" id="${id + "-checkbox"}" /> </td><td>${tableData[eachCol][i]}</td><td><input id="${id}" type="text"/></td>`
    
            })
            TableRows += `</tr>`
    
            document.getElementById("tbody").innerHTML = TableRows;
    
        }

            let CommonExpectationsData = "";
        ["expect_column_to_exist",
    
            "expect_table_columns_to_match_ordered_list",
    
            "expect_table_columns_to_match_set",
    
            "expect_table_row_count_to_be_between",
    
            "expect_table_row_count_to_equal",
    
            "expect_table_row_count_to_equal_other_table"].map((eachExpe, expIndex) => {
                CommonExpectationsData += `
        <tr>
        <td>
            <label for=${eachExpe}></label>
            <input type="checkbox" id="${eachExpe + "-checkbox"}" >
        </td>
        <td>${eachExpe}
        <td> <input type="text" id=${eachExpe} ></td>
      </tr>
        `
            })

            document.getElementById("CommonExpectationsTableBody").innerHTML = CommonExpectationsData;
    
                document.getElementById('MainColumns').innerHTML = MainHeaderColumns
                document.getElementById('SubColumns').innerHTML = SubHeaderColumns
    }
 
//Sending user printabel value to flask api 

    // const gcp_sendExpectationList = () => {
    //     const final1 = {}
    //     const kk = localStorage.getItem("file");
    //     localStorage.removeItem('file');

    //     console.log(JSON.parse(kk))
    //     let tableData = JSON.parse(kk);
    //     let commonExpectationTableData = ["expect_column_to_exist",
    
    //         "expect_table_columns_to_match_ordered_list",
    
    //         "expect_table_columns_to_match_set",
    
    //         "expect_table_row_count_to_be_between",
    
    //         "expect_table_row_count_to_equal",
    
    //         "expect_table_row_count_to_equal_other_table"]
    
    //     final1["UniqueExpectations"] = {}
    
    //     Object.keys(tableData).forEach((col) => {
    //         final1["UniqueExpectations"][col] = {};
    //         tableData[col].forEach(val => {
    //             if (document.getElementById(col.toLowerCase() + "-" + val.toLowerCase() + "-checkbox").checked) {
    //                 final1["UniqueExpectations"][col][val] = document.getElementById(col.toLowerCase() + "-" + val.toLowerCase()).value
    //             }
    //         })
    //     })
    
    
    
    //     final1["CommonExpectationsData"] = {};
    //     commonExpectationTableData.forEach((col) => {
    //             if (document.getElementById(col.toLowerCase() + "-checkbox").checked) {
    //                 final1["CommonExpectationsData"][col] = document.getElementById(col).value
    //             }
    //     })
    
    
    
    //     console.log("final1==============:", final1)
    //     const url = "http://localhost:5000/gcp_sendExpectation"
    //     fetch(url, { method: 'POST', body: JSON.stringify({"test": final1}) }).then((response) => {
    //         console.log(response)
    //     })
    //     alert("send successfully");
    
    // }

function  onFieldsChangeAwsCloud (event){
    
    const File=document.getElementById("aws_file")?.files[0]
    const file_name = document.getElementById("aws_file")?.files[0]["name"];
    // const File_Path=document.getElementById("filePath").value;
    const bucket_name=document.getElementById("aws_bucket_name").value;
    const file_path=document.getElementById("aws_file_path").value;
    // console.log({file_name, bucket_name, file_path})
    if(file_name && bucket_name && file_path){
        document.getElementById('valid_aws').disabled = false;
    }
}
function  onFieldsChangeGCPCloud (event){
    
    const File=document.getElementById("gcp_file")?.files[0]
    const file_name = document.getElementById("gcp_file")?.files[0]["name"];
    // const File_Path=document.getElementById("filePath").value;
    const bucket_name=document.getElementById("Gcp_bucket_name").value;
    const file_path=document.getElementById("Gcp_FilePath").value;
    // console.log({file_name, bucket_name, file_path})
    if(file_name && bucket_name && file_path){
        document.getElementById('gcp_submit').disabled = false;
    }
}


async function mail_crud() {
    const sender_mail=document.getElementById("sender").value;
    const receiver_mail=document.getElementById("receiver").value;
    const mail_credentials={"sender_name": sender_mail,"receiver_mail":receiver_mail}
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var res = xhttp.responseText;
            let response = (res)
            console.log(JSON.parse(response));
            document.getElementById("success").style.display = "block";
        } else if (this.readyState == 4 && (this.status == 404 || this.status == 500 || this.status == 303)) {
            alert("Error With the Data.")
        }
    };
    xhttp.open("POST", "http://127.0.0.1:5000/mail_crud", true);
    xhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhttp.send(JSON.stringify( mail_credentials));
}

function sendExpectation_uploadFile(){
    const final1 = {}
        const kk = localStorage.getItem("file");
        console.log(JSON.parse(kk))
        let tableData = JSON.parse(kk);
        let commonExpectationTableData = ["expect_column_to_exist",
    
            "expect_table_columns_to_match_ordered_list",
    
            "expect_table_columns_to_match_set",
    
            "expect_table_row_count_to_be_between",
    
            "expect_table_row_count_to_equal",
    
            "expect_table_row_count_to_equal_other_table"]
    
        final1["UniqueExpectations"] = {}
    
        Object.keys(tableData).forEach((col) => {
            final1["UniqueExpectations"][col] = {};
            tableData[col].forEach(val => {
                if (document.getElementById(col.toLowerCase() + "-" + val.toLowerCase() + "-checkbox").checked) {
                    final1["UniqueExpectations"][col][val] = document.getElementById(col.toLowerCase() + "-" + val.toLowerCase()).value
                }
            })
        })
    
    
    
        final1["CommonExpectationsData"] = {};
        commonExpectationTableData.forEach((col) => {
                if (document.getElementById(col.toLowerCase() + "-checkbox").checked) {
                    final1["CommonExpectationsData"][col] = document.getElementById(col).value
                }
        })
        console.log("final1==============:", final1)
        const url = "http://localhost:5000/file_GE"
        fetch(url, { method: 'POST', body: JSON.stringify({"test": final1}) }).then((response) => {
            console.log(response)
            alert("send successfully");
            RouteToNext({target:{id:"mailer"}});

        })
        
        // Result_page();
        // RouteToNext({target:{id:"mailer"}});
    //    const kk1 = JSON.stringify({"test": final1})
    //     var xhttp = new XMLHttpRequest();
    //     xhttp.onreadystatechange = function () {
    //         if (this.readyState == 4 && this.status == 200) {
    //             var res = xhttp.responseText;
    //             let response = (res)
    //             alert("send successfully");
    //             console.log(JSON.parse(response));
    //          } else if (this.readyState == 4 && (this.status == 404 || this.status == 500 || this.status == 303)) {
    //             alert("Error With the Data.");
    //         }
    //     };
    //     xhttp.open("POST", "http://127.0.0.1:5000/file_GE", true);
    //     xhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    //     xhttp.send(kk1);
}

