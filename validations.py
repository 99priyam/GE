import great_expectations as ge
import pandas as pd

class validations:
    def ge_validations(act_df, exp_df):
        print('validations starts')
        df = act_df
        res = []
        expectations = [(i,j) for i,j in zip(exp_df["expectation"],exp_df["parameter"])]
        if df is not None or expectations is not None:
            ge_df = ge.dataset.PandasDataset(df)
            for expectation in expectations:
                if expectation[0] == 'expect_column_to_exist':
                    param=str(expectation[1])
                    r = ge_df.expect_column_to_exist(param,catch_exceptions=True)
                    r = {"Expectation Name":expectation[0],'Parameters Passed':param,'Exception Info':r['exception_info'],'Success':r['success']}
                    res.append(r)
                elif expectation[0] == 'expect_table_columns_to_match_ordered_list':
                    params=str(expectation[1]).split(",")
                    r = ge_df.expect_table_columns_to_match_ordered_list(params,catch_exceptions=True)
                    r = {"Expectation Name":expectation[0],'Parameters Passed':params,'Exception Info':r['exception_info'],'Success':r['success'],'Result':r['result']}
                    res.append(r)
                elif expectation[0] == 'expect_table_columns_to_match_set':
                    params=str(expectation[1]).split(",")
                    if 'True' in params:
                        r = ge_df.expect_table_columns_to_match_set(params[:-1],exact_match=True,catch_exceptions=True)
                        r = {"Expectation Name":expectation[0],'Parameters Passed':params,'Exception Info':r['exception_info'],'Success':r['success'],'Result':r['result']}
                        res.append(r)
                    elif 'False' in params:
                        r = ge_df.expect_table_columns_to_match_set(params[:-1],exact_match=False,catch_exceptions=True)
                        r = {"Expectation Name":expectation[0],'Parameters Passed':params,'Exception Info':r['exception_info'],'Success':r['success'],'Result':r['result']}
                        res.append(r)
                    else:
                        r=ge_df.expect_table_columns_to_match_set(params,catch_exceptions=True)
                        r = {"Expectation Name":expectation[0],'Parameters Passed':params,'Exception Info':r['exception_info'],'Success':r['success'],'Result':r['result']}
                        res.append(r)
                elif expectation[0] == 'expect_table_row_count_to_be_between':
                    params=str(expectation[1]).split(",")
                    r = ge_df.expect_table_row_count_to_be_between(params[0],params[1],catch_exceptions=True)
                    r = {"Expectation Name":expectation[0],'Parameters Passed':params,'Exception Info':r['exception_info'],'Success':r['success'],'Result':r['result']}
                    res.append(r)
                elif expectation[0] == 'expect_table_row_count_to_equal':
                    param = str(expectation[1])
                    r = ge_df.expect_table_row_count_to_equal(param, catch_exceptions=True)
                    r = {"Expectation Name":expectation[0],'Parameters Passed':params,'Exception Info':r['exception_info'],'Success':r['success'],'Result':r['result']}
                    res.append(r)
                elif expectation[0] == 'expect_column_values_to_be_unique':
                    params = str(expectation[1]).split(",")
                    if len(params)>1:
                        r = ge_df.expect_column_values_to_be_unique(params[0],mostly=float(params[1]),catch_exceptions=True)
                        r = {"Expectation Name":expectation[0],'Parameters Passed':params,'Exception Info':r['exception_info'],'Success':r['success'],'Result':r['result']}
                        res.append(r)
                    else:
                        r = ge_df.expect_column_values_to_be_unique(params[0],catch_exceptions=True)
                        r = {"Expectation Name":expectation[0],'Parameters Passed':params,'Exception Info':r['exception_info'],'Success':r['success'],'Result':r['result']}
                        res.append(r)
                elif expectation[0] == 'expect_column_values_to_not_be_null':
                    params = str(expectation[1]).split(",")
                    if len(params)>1:
                        r = ge_df.expect_column_values_to_not_be_null(params[0],mostly=float(params[1]),catch_exceptions=True)
                        r = {"Expectation Name":expectation[0],'Parameters Passed':params,'Exception Info':r['exception_info'],'Success':r['success'],'Result':r['result']}
                        res.append(r)
                    else:
                        r = ge_df.expect_column_values_to_not_be_null(params[0],catch_exceptions=True)
                        r = {"Expectation Name":expectation[0],'Parameters Passed':params,'Exception Info':r['exception_info'],'Success':r['success'],'Result':r['result']}
                        res.append(r)
                elif expectation[0] == 'expect_column_values_to_be_null':
                    params = str(expectation[1]).split(",")
                    if len(params)>1:
                        r = ge_df.expect_column_values_to_be_null(params[0],mostly=float(params[1]),catch_exceptions=True)
                        r = {"Expectation Name":expectation[0],'Parameters Passed':params,'Exception Info':r['exception_info'],'Success':r['success'],'Result':r['result']}
                        res.append(r)
                    else:
                        r = ge_df.expect_column_values_to_be_null(params[0],catch_exceptions=True)
                        r = {"Expectation Name":expectation[0],'Parameters Passed':params,'Exception Info':r['exception_info'],'Success':r['success'],'Result':r['result']}
                        res.append(r)
                elif expectation[0] == 'expect_column_values_to_be_of_type':
                    params = str(expectation[1]).split(",")
                    r = ge_df.expect_column_values_to_be_of_type(params[0],params[1],catch_exceptions=True)
                    r = {"Expectation Name":expectation[0],'Parameters Passed':params,'Exception Info':r['exception_info'],'Success':r['success'],'Result':r['result']}
                    res.append(r)
                elif expectation[0] == 'expect_column_values_to_be_in_type_list':
                    params = str(expectation[0]).split(",")
                    r = ge_df.expect_column_values_to_be_in_type_list(params[0],params[1:],catch_exceptions=True)
                    r = {"Expectation Name":expectation[0],'Parameters Passed':params,'Exception Info':r['exception_info'],'Success':r['success'],'Result':r['result']}
                    res.append(r)
                elif expectation[0] == 'expect_column_values_to_be_in_set':
                    params = str(expectation[1]).split(",")
                    r = ge_df.expect_column_values_to_be_in_set(params[0], params[1:], catch_exceptions=True)
                    r = {"Expectation Name":expectation[0],'Parameters Passed':params,'Exception Info':r['exception_info'],'Success':r['success'],'Result':r['result']}
                    res.append(r)
                elif expectation[0] == 'expect_column_values_to_not_be_in_set':
                    params = str(expectation[1]).split(",")
                    r = ge_df.expect_column_values_to_not_be_in_set(params[0], params[1:], catch_exceptions=True)
                    r = {"Expectation Name":expectation[0],'Parameters Passed':params,'Exception Info':r['exception_info'],'Success':r['success'],'Result':r['result']}
                    res.append(r)
                elif expectation[0] == 'expect_column_values_to_be_between':
                    params = str(expectation[1]).split(",")
                    r = ge_df.expect_column_values_to_be_between(params[0], min_value=params[1], max_value=params[2], catch_exceptions=True)
                    r = {"Expectation Name":expectation[0],'Parameters Passed':params,'Exception Info':r['exception_info'],'Success':r['success'],'Result':r['result']}
                    res.append(r)
        return res
                
        # send_email('scrappertmw.123@gmail.com',['sanjeev.kumar@dhiomics.com'],'eygrhklhidizmozc',res,f'Great Expectations QC REPORT DEMO_1 on {act_df.split(".")[1]}')
        # email_notification.send_email('priyamghosh0412@gmail.com',['priyam.ghosh@dhiomics.com'],res)
# validations.get_expectations('DBO.FACTFINANCE',1)
# validations.get_dataframe('DBO.FACTFINANCE')
# act_df = pd.read_csv(r"C:\Users\User\Desktop\GE UI V5\Developed_UI For Greate_Expectation\TEMP\act_df.csv")
# exp_df = pd.read_csv(r"C:\Users\User\Desktop\GE UI V5\Developed_UI For Greate_Expectation\TEMP\exp_df.csv")
# result = validations.ge_validations(act_df, exp_df)
# print(result)


