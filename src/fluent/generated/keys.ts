import '@servicenow/sdk/global'

declare global {
    namespace Now {
        namespace Internal {
            interface Keys extends KeysRegistry {
                explicit: {
                    acl_analytics_execute: {
                        table: 'sys_security_acl'
                        id: 'b154a8a7802247b3a0f1c846e8956c7a'
                    }
                    acl_category_create: {
                        table: 'sys_security_acl'
                        id: '44cc69a9fd464555839429cf90f16baa'
                    }
                    acl_category_delete: {
                        table: 'sys_security_acl'
                        id: '6e5407fff425402aae77a554aaa07d33'
                    }
                    acl_category_read: {
                        table: 'sys_security_acl'
                        id: 'a7d1f5cd85144c8ab2a84777aae4c661'
                    }
                    acl_category_write: {
                        table: 'sys_security_acl'
                        id: 'c5d6184953384363a42c4131969cec4a'
                    }
                    acl_consumption_create: {
                        table: 'sys_security_acl'
                        id: '4302f2c61e6b48cca9fca4f024c31ae1'
                    }
                    acl_consumption_delete: {
                        table: 'sys_security_acl'
                        id: '35ab431dbe8e4b15a1fd9ba98fc327e2'
                    }
                    acl_consumption_read: {
                        table: 'sys_security_acl'
                        id: '585baf4422db424791c23d0bc124fca5'
                    }
                    acl_consumption_write: {
                        table: 'sys_security_acl'
                        id: 'e2443bf43259435790523c88c940c537'
                    }
                    acl_purchase_create: {
                        table: 'sys_security_acl'
                        id: 'c71358292e084857ae937955821c0b25'
                    }
                    acl_purchase_delete: {
                        table: 'sys_security_acl'
                        id: '3f235275d76147898290d943e00637ea'
                    }
                    acl_purchase_read: {
                        table: 'sys_security_acl'
                        id: '2ad00212dad24846be4a84b737b1aa08'
                    }
                    acl_purchase_write: {
                        table: 'sys_security_acl'
                        id: '7bfb4f351016408186982810a59bb3b2'
                    }
                    bom_json: {
                        table: 'sys_module'
                        id: 'bfa31178e2a84328ad89fe0402c66098'
                    }
                    br_compute_utilization: {
                        table: 'sys_script'
                        id: '5bb4d4b6907e4966a01c5149f39d33ae'
                    }
                    job_monthly_snapshot: {
                        table: 'sysauto_script'
                        id: 'db000913251b405585cb48959f0c4bf6'
                    }
                    menu_licutil: {
                        table: 'sys_app_application'
                        id: '1e61d77d02144d52b6a596f73bdcd14a'
                    }
                    mod_category: {
                        table: 'sys_app_module'
                        id: '5f25e98262a2420988542fb952b6ad41'
                    }
                    mod_consumption: {
                        table: 'sys_app_module'
                        id: '0e601fefbce34f359f25ad11f1274011'
                    }
                    mod_dashboard: {
                        table: 'sys_app_module'
                        id: '5576db96171e4bc397df769668c534e9'
                    }
                    mod_purchase: {
                        table: 'sys_app_module'
                        id: 'e773912bba124317bc41ff8d158d2abd'
                    }
                    mod_sep_admin: {
                        table: 'sys_app_module'
                        id: '5b99495e70ef44d699541390bf1d8b4d'
                    }
                    package_json: {
                        table: 'sys_module'
                        id: '39a3ce4788fb42199e0e700a93d25943'
                    }
                    seed_cat_prem: {
                        table: 'x_1983_licutil_category'
                        id: 'f1b6a673f6364e98a910531f4a3e1efe'
                    }
                    seed_cat_pro: {
                        table: 'x_1983_licutil_category'
                        id: 'ac9efa58a49044158bfa47acbb02829c'
                    }
                    seed_cat_std: {
                        table: 'x_1983_licutil_category'
                        id: '4bb443a80c644bd791122835a537f872'
                    }
                    seed_con_prem_03: {
                        table: 'x_1983_licutil_consumption'
                        id: '92162dd5dffb4e3987b0bb00f60d5b6e'
                    }
                    seed_con_prem_04: {
                        table: 'x_1983_licutil_consumption'
                        id: 'fdfcdf9944aa4102b92b0954675a3027'
                    }
                    seed_con_prem_05: {
                        table: 'x_1983_licutil_consumption'
                        id: 'ef0be53fa0e54d86999078909411a63c'
                    }
                    seed_con_prem_06: {
                        table: 'x_1983_licutil_consumption'
                        id: '39ea4c35d94441dc815557b7ea38d48e'
                    }
                    seed_con_pro_03: {
                        table: 'x_1983_licutil_consumption'
                        id: '63260f9e40bc49e2b46f265f0148ee47'
                    }
                    seed_con_pro_04: {
                        table: 'x_1983_licutil_consumption'
                        id: '1964e7ac5f664ae3a45907ccb08a4362'
                    }
                    seed_con_pro_05: {
                        table: 'x_1983_licutil_consumption'
                        id: 'f04a1017c90342de8271ca41314e9ba0'
                    }
                    seed_con_pro_06: {
                        table: 'x_1983_licutil_consumption'
                        id: '3674851529e34feebb329f08f3662a0e'
                    }
                    seed_con_std_03: {
                        table: 'x_1983_licutil_consumption'
                        id: 'e3389ec26b084534aaa29e7361b99531'
                    }
                    seed_con_std_04: {
                        table: 'x_1983_licutil_consumption'
                        id: 'ca850a59909b4393b2a0b341e6796a7f'
                    }
                    seed_con_std_05: {
                        table: 'x_1983_licutil_consumption'
                        id: 'f1da1881e861469fa585564972a633a7'
                    }
                    seed_con_std_06: {
                        table: 'x_1983_licutil_consumption'
                        id: '5b37ef2b96f64f50a13e917865045730'
                    }
                    seed_pur_prem: {
                        table: 'x_1983_licutil_purchase'
                        id: '5e7d18155c794f3dbea770b6652975fc'
                    }
                    seed_pur_pro: {
                        table: 'x_1983_licutil_purchase'
                        id: '67e0bce3777c4f4082f7939a52407dd2'
                    }
                    seed_pur_std: {
                        table: 'x_1983_licutil_purchase'
                        id: 'fc9b39bb0737494ab17de0438045aa07'
                    }
                    si_license_analytics: {
                        table: 'sys_script_include'
                        id: 'ba47f93d868b43ca9aa9e3efd329d36d'
                    }
                    src_server_dashboard_client_js: {
                        table: 'sys_module'
                        id: 'eb4806564c7b4482a56bd03a9eaf5e91'
                    }
                    src_server_LicenseAnalytics_server_js: {
                        table: 'sys_module'
                        id: '203a5c78d510401a83684ea42338203d'
                    }
                    src_server_snapshot_js: {
                        table: 'sys_module'
                        id: '1f8951ee995542bfb39baa5d141a2782'
                    }
                }
                composite: [
                    {
                        table: 'sys_choice'
                        id: '1672a13746b1458d8f60e52cb68b7d36'
                        key: {
                            name: 'x_1983_licutil_category'
                            element: 'capability'
                            value: 'itom'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '17ca2c53b8f048b09d4d7c648606ecd5'
                        key: {
                            sys_security_acl: 'b154a8a7802247b3a0f1c846e8956c7a'
                            sys_user_role: {
                                id: '35c958ce8cfe4b19ba437e97b05f7cdf'
                                key: {
                                    name: 'x_1983_licutil.viewer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '1b08ca1af1234c16ac4926375b845405'
                        key: {
                            name: 'x_1983_licutil_consumption'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '1c47aa84667f41f0b1dd12ec1d6311e2'
                        key: {
                            sys_security_acl: '3f235275d76147898290d943e00637ea'
                            sys_user_role: {
                                id: '0c878299f1ad4c43bf4cb0b6860104fa'
                                key: {
                                    name: 'x_1983_licutil.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '1dc323a5ce0b42758388f22e74883e34'
                        key: {
                            name: 'x_1983_licutil_consumption'
                            element: 'utilization_pct'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '1e9ecaf97cae4e6fb1c5a23c78cdf7fb'
                        key: {
                            name: 'x_1983_licutil_category'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '25095f8503c34bf08f471b07fe477ffc'
                        key: {
                            name: 'x_1983_licutil_category'
                            element: 'description'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '260a50d77a064c9b87cfd276f283f492'
                        key: {
                            name: 'x_1983_licutil_purchase'
                            element: 'period'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '2c807202a7d54981bc9ded593cb6b18e'
                        key: {
                            name: 'x_1983_licutil_category'
                            element: 'capability'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '2c95108dabef42738cad902ed5caecf1'
                        key: {
                            name: 'x_1983_licutil_consumption'
                            element: 'consumed'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_user_role'
                        id: '3b37b2860c554b2c8a0a8e04d1f92451'
                        key: {
                            name: 'x_1983_licutil.viewer'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '4106dd684f4547e3b58cf1b51f85cd22'
                        key: {
                            name: 'x_1983_licutil_consumption'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '4c5c92474a5545bdbcb46432b521910e'
                        key: {
                            name: 'x_1983_licutil_purchase'
                            element: 'licenses_purchased'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '50cca65af4c2404c8c59f75d7c78748d'
                        key: {
                            sys_security_acl: '7bfb4f351016408186982810a59bb3b2'
                            sys_user_role: {
                                id: '43276d7a380944238d63f484bdbeb623'
                                key: {
                                    name: 'x_1983_licutil.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '5a99ab5c6b5d43508f6092ae092df690'
                        key: {
                            sys_security_acl: '44cc69a9fd464555839429cf90f16baa'
                            sys_user_role: {
                                id: '676c4292c3124e6e9e9d3954663ed3cc'
                                key: {
                                    name: 'x_1983_licutil.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '5aa44aebc99540c792a9fc55397b434c'
                        key: {
                            name: 'x_1983_licutil_category'
                            element: 'current_consumed'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '6360a1af0a1f4edf9518a541342b4d3c'
                        key: {
                            name: 'x_1983_licutil_consumption'
                            element: 'category'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '64f565922ba14df08b2362ea98718983'
                        key: {
                            name: 'x_1983_licutil_consumption'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6ae4d8d5d0104d3e9f5f93079b94c98d'
                        key: {
                            name: 'x_1983_licutil_consumption'
                            element: 'category'
                            language: 'en'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '6e3743f7dd2540f590b454e15f24519e'
                        key: {
                            name: 'x_1983_licutil_category'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '7742ca372a934cb38e97b88a78b995e1'
                        key: {
                            name: 'x_1983_licutil_category'
                            element: 'capability'
                            value: 'itsm'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '776000d1f5bd437e8fc068e16bc9ee60'
                        key: {
                            name: 'x_1983_licutil_purchase'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '781e664fa22d48c0a9849df608378548'
                        key: {
                            sys_security_acl: 'e2443bf43259435790523c88c940c537'
                            sys_user_role: {
                                id: 'b87b07d2c24a4a0bbb4523cd188fbf77'
                                key: {
                                    name: 'x_1983_licutil.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '7e008f9e633b4c55b378f002a687341a'
                        key: {
                            sys_security_acl: '585baf4422db424791c23d0bc124fca5'
                            sys_user_role: {
                                id: 'dcd0e8173020483a94801e6009121df0'
                                key: {
                                    name: 'x_1983_licutil.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '80576286f3094ca5883aa663453f78e1'
                        key: {
                            sys_security_acl: '4302f2c61e6b48cca9fca4f024c31ae1'
                            sys_user_role: {
                                id: '71d1b17ab50c488caf41bd0557b4e67f'
                                key: {
                                    name: 'x_1983_licutil.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '830bee4307ef40109f902e9a89d395e6'
                        key: {
                            sys_security_acl: '6e5407fff425402aae77a554aaa07d33'
                            sys_user_role: {
                                id: 'f7f48f1569af4e1386f68052b8ec8f47'
                                key: {
                                    name: 'x_1983_licutil.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '89fb821ff7554316945306bb688f28bc'
                        key: {
                            name: 'x_1983_licutil_consumption'
                            element: 'period_month'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '8ae9e8b84b28421584274bc76cca5d63'
                        key: {
                            name: 'x_1983_licutil_category'
                            element: 'capability'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '8ca57de8d14245a489f19bc4201d3d62'
                        key: {
                            name: 'x_1983_licutil_purchase'
                            element: 'period'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '8d7795d5926e49f2a2a8055d7132f7b7'
                        key: {
                            name: 'x_1983_licutil_category'
                            element: 'name'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '917dc7f9c4af49de89af5ad834a9544b'
                        key: {
                            name: 'x_1983_licutil_purchase'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '93ed39c269f34e1db860b5ba8f4cc8c6'
                        key: {
                            name: 'x_1983_licutil_category'
                            element: 'capability'
                            value: 'secops'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '953d0f91d3334935a56cc4ae3695d3a9'
                        key: {
                            name: 'x_1983_licutil_purchase'
                            element: 'licenses_purchased'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '95c2f91377294a56ac5da3b9ed270888'
                        key: {
                            sys_security_acl: 'a7d1f5cd85144c8ab2a84777aae4c661'
                            sys_user_role: {
                                id: 'cca5617233f44e3085b5cc0109eb7fcd'
                                key: {
                                    name: 'x_1983_licutil.viewer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '962ca57217104c92b7ce76bf51c6e257'
                        key: {
                            name: 'x_1983_licutil_purchase'
                            element: 'notes'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '96d3472bed0b4f0798d213418063d3c9'
                        key: {
                            name: 'x_1983_licutil_category'
                            element: 'active'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '971a21cb58ca4d389248f6f94bff0145'
                        key: {
                            name: 'x_1983_licutil_category'
                            element: 'current_consumed'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '9deb1eaafcce4805aeb2907bfea912e7'
                        key: {
                            name: 'x_1983_licutil_category'
                            element: 'sku_code'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a2f76b398e764d9aa4d6bb599e440cb8'
                        key: {
                            name: 'x_1983_licutil_category'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_user_role'
                        id: 'a5fd1943b32d45bf84c5ed6988247c65'
                        key: {
                            name: 'x_1983_licutil.admin'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a65a8011351d4cbc8b6fcabdf7d4ba1d'
                        key: {
                            name: 'x_1983_licutil_purchase'
                            element: 'purchase_date'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'a81c7d4180014dbdbb4b7d545350acd3'
                        key: {
                            sys_security_acl: '585baf4422db424791c23d0bc124fca5'
                            sys_user_role: {
                                id: '05357b0dc828475e84f499bcaca2f0bc'
                                key: {
                                    name: 'x_1983_licutil.viewer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a8ba29d3d7e34289afce0730e38c0681'
                        key: {
                            name: 'x_1983_licutil_category'
                            element: 'sku_code'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'af613caa6a30448295094d649418edf4'
                        key: {
                            name: 'x_1983_licutil_consumption'
                            element: 'snapshot_date'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'afb7271be0f84184a8cd0771308375c9'
                        key: {
                            name: 'x_1983_licutil_consumption'
                            element: 'period_month'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'b1233bbfb60142539564ece56ccdfe2f'
                        key: {
                            sys_security_acl: 'a7d1f5cd85144c8ab2a84777aae4c661'
                            sys_user_role: {
                                id: '7f86a07d0399466795538f7a886c55b4'
                                key: {
                                    name: 'x_1983_licutil.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b19ed24a8f0e4abc93ede09ea70116ce'
                        key: {
                            name: 'x_1983_licutil_purchase'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'b6c46ab7c7d849c693701f2727c4ebdc'
                        key: {
                            name: 'x_1983_licutil_category'
                            element: 'capability'
                            value: 'other'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'be389e56f3cd47a68217be3d397c47d7'
                        key: {
                            sys_security_acl: '2ad00212dad24846be4a84b737b1aa08'
                            sys_user_role: {
                                id: 'e332f225fe484231a720308749954556'
                                key: {
                                    name: 'x_1983_licutil.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'c2706fc347a4443599c7d57ec33212de'
                        key: {
                            sys_security_acl: 'b154a8a7802247b3a0f1c846e8956c7a'
                            sys_user_role: {
                                id: 'a2738ca531534d35a8ace125b10f7050'
                                key: {
                                    name: 'x_1983_licutil.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'c459b9883e384ccda2b1813d6aaf4940'
                        key: {
                            sys_security_acl: 'c5d6184953384363a42c4131969cec4a'
                            sys_user_role: {
                                id: '82aa0dccd1374b429280b78c8641669e'
                                key: {
                                    name: 'x_1983_licutil.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'c47f8547709a421f9c821503cd309d49'
                        key: {
                            sys_security_acl: '35ab431dbe8e4b15a1fd9ba98fc327e2'
                            sys_user_role: {
                                id: '3e407e7c3b9a40c9b9ff127da5c1a505'
                                key: {
                                    name: 'x_1983_licutil.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'c8231d60c58d4c6ab96ea550e4af2e8d'
                        key: {
                            name: 'x_1983_licutil_category'
                            element: 'capability'
                            value: 'platform_analytics'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: 'c86a94bbbb7841dfb3c839056ad26724'
                        key: {
                            name: 'x_1983_licutil_purchase'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: 'c88f3baf85f0494097713d6e9d9951b9'
                        key: {
                            name: 'x_1983_licutil_consumption'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'ca97a577b9aa4ede9c62f9fdd287557b'
                        key: {
                            name: 'x_1983_licutil_category'
                            element: 'capability'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'cf2c2c78ae7944eda6a30d8657635bc8'
                        key: {
                            name: 'x_1983_licutil_category'
                            element: 'description'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'd650ce2ca2534452bad2de6f21709ba0'
                        key: {
                            name: 'x_1983_licutil_category'
                            element: 'capability'
                            value: 'hrsd'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'd71220b5e11a4ef1b7c5744ea793db3c'
                        key: {
                            name: 'x_1983_licutil_consumption'
                            element: 'consumed'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'db268bf2d2d541449044cacd975c44db'
                        key: {
                            name: 'x_1983_licutil_purchase'
                            element: 'category'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'dcb3ef61b9974bdd8a5b8f24e46209f7'
                        key: {
                            name: 'x_1983_licutil_consumption'
                            element: 'snapshot_date'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'de7887b36f0b4ec5bb11188dae21881e'
                        key: {
                            name: 'x_1983_licutil_consumption'
                            element: 'purchased'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'e47967119012458e9525b624ba16c679'
                        key: {
                            name: 'x_1983_licutil_category'
                            element: 'active'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'e9faa2f7bd174b0d930080e38ea8a0f8'
                        key: {
                            name: 'x_1983_licutil_purchase'
                            element: 'category'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'eabb9ff4a05b4f0eb2bede20fc5d779b'
                        key: {
                            name: 'x_1983_licutil_purchase'
                            element: 'notes'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: 'f00162adefcf430fb534a1158a35b873'
                        key: {
                            name: 'x_1983_licutil_category'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'f150a74a38314500b23a81702305c3ea'
                        key: {
                            name: 'x_1983_licutil_consumption'
                            element: 'utilization_pct'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'f1796e75936045828b59b521c64ddba5'
                        key: {
                            name: 'x_1983_licutil_category'
                            element: 'name'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'f291553d13434e8eacd5cf2ad9801d9d'
                        key: {
                            sys_security_acl: 'c71358292e084857ae937955821c0b25'
                            sys_user_role: {
                                id: 'a8aad70ae19d4c60b649ae50f858c836'
                                key: {
                                    name: 'x_1983_licutil.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'f4e166f31c1d4bdca0ab2c9482e4d5d4'
                        key: {
                            name: 'x_1983_licutil_consumption'
                            element: 'purchased'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'f601bf706bcb4ecea0b4cad86fdc5db7'
                        key: {
                            sys_security_acl: '2ad00212dad24846be4a84b737b1aa08'
                            sys_user_role: {
                                id: 'a89d3707af0f4666b13f0566ecb35ba6'
                                key: {
                                    name: 'x_1983_licutil.viewer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_page'
                        id: 'f869ef4b43544579b6c9538323e70577'
                        key: {
                            endpoint: 'x_1983_licutil_dashboard.do'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'f969d7912c8242beafaae159e6e27426'
                        key: {
                            name: 'x_1983_licutil_purchase'
                            element: 'purchase_date'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'fe133d59bb2e4726b5d30e4fde0cc616'
                        key: {
                            name: 'x_1983_licutil_category'
                            element: 'capability'
                            value: 'csm'
                        }
                    },
                ]
            }
        }
    }
}
