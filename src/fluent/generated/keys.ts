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
                    acl_rollup_create: {
                        table: 'sys_security_acl'
                        id: '04f702aca16047f78a32edcca925e095'
                    }
                    acl_rollup_delete: {
                        table: 'sys_security_acl'
                        id: 'e6633ffef6514ba4a4ef03c4cfd347ce'
                    }
                    acl_rollup_read: {
                        table: 'sys_security_acl'
                        id: 'df08c5a1ff894a128313e3e943b77ec5'
                    }
                    acl_rollup_write: {
                        table: 'sys_security_acl'
                        id: '96bb10740f414a55951aa0b899c0237c'
                    }
                    bom_json: {
                        table: 'sys_module'
                        id: 'bfa31178e2a84328ad89fe0402c66098'
                    }
                    br_compute_utilization: {
                        table: 'sys_script'
                        id: '5bb4d4b6907e4966a01c5149f39d33ae'
                    }
                    evt_summary_email: {
                        table: 'sysevent_register'
                        id: '5c9952bd57cf4b88998273620e016bff'
                    }
                    job_monthly_snapshot: {
                        table: 'sysauto_script'
                        id: 'db000913251b405585cb48959f0c4bf6'
                    }
                    job_org_rollup: {
                        table: 'sysauto_script'
                        id: '2521e3aaa3fc42198722373e79276bea'
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
                    mod_org_rollup: {
                        table: 'sys_app_module'
                        id: 'fccb103b52154cd6af6316960877b417'
                    }
                    mod_purchase: {
                        table: 'sys_app_module'
                        id: 'e773912bba124317bc41ff8d158d2abd'
                    }
                    mod_sep_admin: {
                        table: 'sys_app_module'
                        id: '5b99495e70ef44d699541390bf1d8b4d'
                    }
                    mod_settings: {
                        table: 'sys_app_module'
                        id: '09a8dee3539842a7b68878ddefa6bba5'
                    }
                    notif_summary_email: {
                        table: 'sysevent_email_action'
                        id: '15d149e97c29414582ab0a8e100b363d'
                    }
                    package_json: {
                        table: 'sys_module'
                        id: '39a3ce4788fb42199e0e700a93d25943'
                    }
                    prop_manager_query: {
                        table: 'sys_properties'
                        id: '7bb60116d6104f2bba14f865976ca265'
                    }
                    seed_cat_biz: {
                        table: 'x_1983_licutil_category'
                        id: '90f6d0919a2241ebad27947c3dda139c'
                    }
                    seed_cat_disc: {
                        table: 'x_1983_licutil_category'
                        id: '914bb292c2594105b921d75b28becf32'
                    }
                    seed_cat_itil: {
                        table: 'x_1983_licutil_category'
                        id: '8c448574f599448fa5b4782bef4db3ea'
                    }
                    seed_cat_nowassist: {
                        table: 'x_1983_licutil_category'
                        id: 'cc2cd0a069b44781aeeae70be8cae32f'
                    }
                    seed_cat_pa: {
                        table: 'x_1983_licutil_category'
                        id: '65fc65328b5a4ee5a66d72281b7b1ddf'
                    }
                    seed_cat_prem: {
                        table: 'x_1983_licutil_category'
                        id: 'f1b6a673f6364e98a910531f4a3e1efe'
                        deleted: true
                    }
                    seed_cat_pro: {
                        table: 'x_1983_licutil_category'
                        id: 'ac9efa58a49044158bfa47acbb02829c'
                        deleted: true
                    }
                    seed_cat_sam: {
                        table: 'x_1983_licutil_category'
                        id: 'c3b7519c88f24ee58f0852ce6a4043d5'
                    }
                    seed_cat_std: {
                        table: 'x_1983_licutil_category'
                        id: '4bb443a80c644bd791122835a537f872'
                        deleted: true
                    }
                    seed_con_biz_05: {
                        table: 'x_1983_licutil_consumption'
                        id: '02064c2c9c6b4b9192a2d7a15fb8b44f'
                    }
                    seed_con_biz_06: {
                        table: 'x_1983_licutil_consumption'
                        id: 'b6f356f6294840dd9efe166de5e1c3cb'
                    }
                    seed_con_disc_05: {
                        table: 'x_1983_licutil_consumption'
                        id: '3c852d3b07c449ba9b2ec3dc3a63fbdf'
                    }
                    seed_con_disc_06: {
                        table: 'x_1983_licutil_consumption'
                        id: '877113ebed8c4aea8cbd97d53cedddbb'
                    }
                    seed_con_itil_05: {
                        table: 'x_1983_licutil_consumption'
                        id: 'f7cbc25a9c9548d9b5f747f33cb5d297'
                    }
                    seed_con_itil_06: {
                        table: 'x_1983_licutil_consumption'
                        id: 'a69c00d6d8e34e22b41e9739f061d78b'
                    }
                    seed_con_na_05: {
                        table: 'x_1983_licutil_consumption'
                        id: '2c65096889bb44db9f69449958ae4ae6'
                    }
                    seed_con_na_06: {
                        table: 'x_1983_licutil_consumption'
                        id: 'efa8d0fa02674ffaa028d32601b66d32'
                    }
                    seed_con_pa_05: {
                        table: 'x_1983_licutil_consumption'
                        id: '3d19bf694fe94ffd994a0b401989bdde'
                    }
                    seed_con_pa_06: {
                        table: 'x_1983_licutil_consumption'
                        id: '05902f6431774c469af4aa34db80d4a6'
                    }
                    seed_con_prem_03: {
                        table: 'x_1983_licutil_consumption'
                        id: '92162dd5dffb4e3987b0bb00f60d5b6e'
                        deleted: true
                    }
                    seed_con_prem_04: {
                        table: 'x_1983_licutil_consumption'
                        id: 'fdfcdf9944aa4102b92b0954675a3027'
                        deleted: true
                    }
                    seed_con_prem_05: {
                        table: 'x_1983_licutil_consumption'
                        id: 'ef0be53fa0e54d86999078909411a63c'
                        deleted: true
                    }
                    seed_con_prem_06: {
                        table: 'x_1983_licutil_consumption'
                        id: '39ea4c35d94441dc815557b7ea38d48e'
                        deleted: true
                    }
                    seed_con_pro_03: {
                        table: 'x_1983_licutil_consumption'
                        id: '63260f9e40bc49e2b46f265f0148ee47'
                        deleted: true
                    }
                    seed_con_pro_04: {
                        table: 'x_1983_licutil_consumption'
                        id: '1964e7ac5f664ae3a45907ccb08a4362'
                        deleted: true
                    }
                    seed_con_pro_05: {
                        table: 'x_1983_licutil_consumption'
                        id: 'f04a1017c90342de8271ca41314e9ba0'
                        deleted: true
                    }
                    seed_con_pro_06: {
                        table: 'x_1983_licutil_consumption'
                        id: '3674851529e34feebb329f08f3662a0e'
                        deleted: true
                    }
                    seed_con_sam_05: {
                        table: 'x_1983_licutil_consumption'
                        id: '09d9f2bda38e4b95896da3cf9a7d1e6f'
                    }
                    seed_con_sam_06: {
                        table: 'x_1983_licutil_consumption'
                        id: 'ad736d457d0c43e396271b4310d80e77'
                    }
                    seed_con_std_03: {
                        table: 'x_1983_licutil_consumption'
                        id: 'e3389ec26b084534aaa29e7361b99531'
                        deleted: true
                    }
                    seed_con_std_04: {
                        table: 'x_1983_licutil_consumption'
                        id: 'ca850a59909b4393b2a0b341e6796a7f'
                        deleted: true
                    }
                    seed_con_std_05: {
                        table: 'x_1983_licutil_consumption'
                        id: 'f1da1881e861469fa585564972a633a7'
                        deleted: true
                    }
                    seed_con_std_06: {
                        table: 'x_1983_licutil_consumption'
                        id: '5b37ef2b96f64f50a13e917865045730'
                        deleted: true
                    }
                    seed_pur_biz: {
                        table: 'x_1983_licutil_purchase'
                        id: '82d77c6b69c641048960bd322f0f4eb6'
                    }
                    seed_pur_disc: {
                        table: 'x_1983_licutil_purchase'
                        id: '78454f6385ea4bd3a3ce33114d11a7ae'
                    }
                    seed_pur_itil: {
                        table: 'x_1983_licutil_purchase'
                        id: '9167ac63cccf4eceab613715d448e4af'
                    }
                    seed_pur_nowassist: {
                        table: 'x_1983_licutil_purchase'
                        id: 'ebe2b3ee849c477ca09127a31692eb3d'
                    }
                    seed_pur_pa: {
                        table: 'x_1983_licutil_purchase'
                        id: '682324349a3a4d22af578a57c24411a8'
                    }
                    seed_pur_prem: {
                        table: 'x_1983_licutil_purchase'
                        id: '5e7d18155c794f3dbea770b6652975fc'
                        deleted: true
                    }
                    seed_pur_pro: {
                        table: 'x_1983_licutil_purchase'
                        id: '67e0bce3777c4f4082f7939a52407dd2'
                        deleted: true
                    }
                    seed_pur_sam: {
                        table: 'x_1983_licutil_purchase'
                        id: '07851e38bc704d22954b808c419d49d3'
                    }
                    seed_pur_std: {
                        table: 'x_1983_licutil_purchase'
                        id: 'fc9b39bb0737494ab17de0438045aa07'
                        deleted: true
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
                    src_server_orgrollup_js: {
                        table: 'sys_module'
                        id: '0b822e555fee4a52b6136bffca2c4f6a'
                    }
                    src_server_snapshot_js: {
                        table: 'sys_module'
                        id: '1f8951ee995542bfb39baa5d141a2782'
                    }
                    xsp_alm_entitlement: {
                        table: 'sys_scope_privilege'
                        id: '0e3cdd591bac4a98b66d001b200c9113'
                    }
                    xsp_cmdb_computer: {
                        table: 'sys_scope_privilege'
                        id: '5e166cce082249eeb5ef69e5b639f7fd'
                    }
                    xsp_cmdb_server: {
                        table: 'sys_scope_privilege'
                        id: 'b4d8e8c77ac44d80afb4093499a43249'
                    }
                    xsp_cmn_department: {
                        table: 'sys_scope_privilege'
                        id: '6c6aa9c0f1414162b011a0bfa1617db4'
                    }
                    xsp_genai_assist: {
                        table: 'sys_scope_privilege'
                        id: '200ea0eb3701403587fb624b9133504c'
                    }
                    xsp_sys_user: {
                        table: 'sys_scope_privilege'
                        id: '238e4a2af31148e19e42a1efe081b591'
                    }
                    xsp_user_has_role: {
                        table: 'sys_scope_privilege'
                        id: 'a656815a5d8e4c0ebd2251ccf3344c3a'
                    }
                }
                composite: [
                    {
                        table: 'sys_documentation'
                        id: '08970d668eac4aea9c4b2e881209af02'
                        key: {
                            name: 'x_1983_licutil_org_rollup'
                            element: 'subject_type'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '0b9b9f2dc8824680aa01378731fd49c5'
                        key: {
                            sys_security_acl: 'df08c5a1ff894a128313e3e943b77ec5'
                            sys_user_role: {
                                id: 'a5fd1943b32d45bf84c5ed6988247c65'
                                key: {
                                    name: 'x_1983_licutil.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '0f006b8320014910b2e3d1024e05aca0'
                        key: {
                            name: 'x_1983_licutil_category'
                            element: 'tier_group'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '1570eac55278450f8756a10de6e3cc4c'
                        key: {
                            name: 'x_1983_licutil_category'
                            element: 'source_table'
                        }
                    },
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
                        id: '1a62feec51c545f8886e4e35f1faa34b'
                        key: {
                            name: 'x_1983_licutil_category'
                            element: 'consumer_ref_field'
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
                        table: 'sys_documentation'
                        id: '2c9e06fc82f844d29f67dc537f2de626'
                        key: {
                            name: 'x_1983_licutil_org_rollup'
                            element: 'snapshot_date'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '2f8a91c299e34080afac1ba72322af54'
                        key: {
                            name: 'x_1983_licutil_org_rollup'
                            element: 'manager'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '351d70988ffe4211ab1c0da4188bd3d5'
                        key: {
                            name: 'x_1983_licutil_category'
                            element: 'precedence'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '3807d6daea1740ca99fd1614c995a1b7'
                        key: {
                            name: 'x_1983_licutil_category'
                            element: 'consumer_ref_field'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '390fd8e5c08743fe8041e3cca763b33c'
                        key: {
                            sys_security_acl: '04f702aca16047f78a32edcca925e095'
                            sys_user_role: {
                                id: 'a5fd1943b32d45bf84c5ed6988247c65'
                                key: {
                                    name: 'x_1983_licutil.admin'
                                }
                            }
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
                        table: 'sys_dictionary'
                        id: '456b9b8d887d4a2db07f7223fb16bb86'
                        key: {
                            name: 'x_1983_licutil_org_rollup'
                            element: 'snapshot_date'
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
                        table: 'sys_dictionary'
                        id: '512698c381ba4e819c3d5cf61137c14a'
                        key: {
                            name: 'x_1983_licutil_org_rollup'
                            element: 'department'
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
                        id: '5add07f4dd7a4d60b71191a3f67a7871'
                        key: {
                            name: 'x_1983_licutil_category'
                            element: 'source_query'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '5c22e46287444b7ea512b938ce69e438'
                        key: {
                            name: 'x_1983_licutil_org_rollup'
                            element: 'NULL'
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
                        table: 'sys_dictionary'
                        id: '64772a01e5e24f65a5131011a3b57dbe'
                        key: {
                            name: 'x_1983_licutil_org_rollup'
                            element: 'subject_label'
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
                        table: 'sys_documentation'
                        id: '6e102104ff65415ebb7b172dadd2b25b'
                        key: {
                            name: 'x_1983_licutil_org_rollup'
                            element: 'population'
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
                        table: 'sys_documentation'
                        id: '6f8c448e7c684f3bb5742f95bd24c3d9'
                        key: {
                            name: 'x_1983_licutil_category'
                            element: 'source_query'
                            language: 'en'
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
                        table: 'sys_documentation'
                        id: '78607d303b8e4739ae546cee8bed4c44'
                        key: {
                            name: 'x_1983_licutil_org_rollup'
                            element: 'category'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '7cf7ac5cfaf84629a1e392852f54efc8'
                        key: {
                            name: 'x_1983_licutil_org_rollup'
                            element: 'manager'
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
                        table: 'sys_choice_set'
                        id: '7e16d3d6a64546d0b6047e9a634efd09'
                        key: {
                            name: 'x_1983_licutil_org_rollup'
                            element: 'subject_type'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '7f3ed925da2a4868b28fac7ff88cf506'
                        key: {
                            name: 'x_1983_licutil_org_rollup'
                            element: 'NULL'
                            language: 'en'
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
                        id: '894ffe43f1684a9faea879d30c0a2b80'
                        key: {
                            name: 'x_1983_licutil_category'
                            element: 'tier_group'
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
                        id: '8e9893aacfd34bc8b60e0ba5c21a58ef'
                        key: {
                            name: 'x_1983_licutil_category'
                            element: 'source_table'
                            language: 'en'
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
                        table: 'sys_choice'
                        id: '97a0d43b8a2e499e9f93f9c929b48d92'
                        key: {
                            name: 'x_1983_licutil_org_rollup'
                            element: 'subject_type'
                            value: 'manager'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '9864689bef8942b0963f34940ad9e514'
                        key: {
                            name: 'x_1983_licutil_category'
                            element: 'precedence'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '990ae16710a94785b163fafda2ccafa9'
                        key: {
                            name: 'x_1983_licutil_category'
                            element: 'count_mode'
                            value: 'subscription_units'
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
                        id: '9e571f71fa4b4c6ca0fb8760552b60d4'
                        key: {
                            name: 'x_1983_licutil_org_rollup'
                            element: 'subject_type'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'a0914e0c624448f4882a00afda32586f'
                        key: {
                            sys_security_acl: 'e6633ffef6514ba4a4ef03c4cfd347ce'
                            sys_user_role: {
                                id: 'a5fd1943b32d45bf84c5ed6988247c65'
                                key: {
                                    name: 'x_1983_licutil.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: 'a129329471cd44dcaa283c52b7fd784a'
                        key: {
                            name: 'x_1983_licutil_category'
                            element: 'count_mode'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'a205cf1dee3744b3a795f94d133fe9f8'
                        key: {
                            name: 'x_1983_licutil_org_rollup'
                            element: 'department'
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
                        table: 'sys_dictionary'
                        id: 'a56e13c7394f4535ab3e68db4af19cb3'
                        key: {
                            name: 'x_1983_licutil_org_rollup'
                            element: 'period_month'
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
                        table: 'sys_documentation'
                        id: 'a7ec4c5dc9f044ef9f0e4fbd04dfeefa'
                        key: {
                            name: 'x_1983_licutil_category'
                            element: 'count_mode'
                            language: 'en'
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
                        id: 'a956c8c373a0448282a1858f5215b23f'
                        key: {
                            name: 'x_1983_licutil_org_rollup'
                            element: 'subject_label'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'a9ffe43ad7464c49b432d44123ad7ec5'
                        key: {
                            name: 'x_1983_licutil_org_rollup'
                            element: 'subject_type'
                            value: 'department'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'aec7c2cf974c471e9954e379c8a84c22'
                        key: {
                            sys_security_acl: 'df08c5a1ff894a128313e3e943b77ec5'
                            sys_user_role: {
                                id: '3b37b2860c554b2c8a0a8e04d1f92451'
                                key: {
                                    name: 'x_1983_licutil.viewer'
                                }
                            }
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
                        table: 'sys_dictionary'
                        id: 'b0cc2b5ed79f4bb7abfc8d839ab30c06'
                        key: {
                            name: 'x_1983_licutil_org_rollup'
                            element: 'category'
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
                        table: 'sys_choice'
                        id: 'b80a15f15423422e97672d7520cba3c7'
                        key: {
                            name: 'x_1983_licutil_category'
                            element: 'count_mode'
                            value: 'records'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'bceb1276560b4477a5c39fefaa54691a'
                        key: {
                            sys_security_acl: '96bb10740f414a55951aa0b899c0237c'
                            sys_user_role: {
                                id: 'a5fd1943b32d45bf84c5ed6988247c65'
                                key: {
                                    name: 'x_1983_licutil.admin'
                                }
                            }
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
                        table: 'ua_table_licensing_config'
                        id: 'ca8edbc483ed41179782778635b33c84'
                        key: {
                            name: 'x_1983_licutil_org_rollup'
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
                        table: 'sys_dictionary'
                        id: 'cca91c12475544189933e94ab7021ae0'
                        key: {
                            name: 'x_1983_licutil_org_rollup'
                            element: 'population'
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
                        table: 'sys_dictionary'
                        id: 'cf6e13fae365411eb15cbfc1efad946b'
                        key: {
                            name: 'x_1983_licutil_category'
                            element: 'consumer_table'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd2e8de26e4604a369bc439a9f03a28f3'
                        key: {
                            name: 'x_1983_licutil_org_rollup'
                            element: 'licensed_users'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: 'd52a06d1336f4d77b9def6ec5723d521'
                        key: {
                            name: 'x_1983_licutil_org_rollup'
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
                        table: 'sys_documentation'
                        id: 'dbe9b317731140bb9aa53b6142cacd1e'
                        key: {
                            name: 'x_1983_licutil_org_rollup'
                            element: 'period_month'
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
                        table: 'sys_documentation'
                        id: 'dd36d0af7f2a4992b3403edc661a7dbc'
                        key: {
                            name: 'x_1983_licutil_category'
                            element: 'su_ratio'
                            language: 'en'
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
                        table: 'sys_dictionary'
                        id: 'e46b1324842d444aabf9e7fe5f4fe951'
                        key: {
                            name: 'x_1983_licutil_org_rollup'
                            element: 'licensed_users'
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
                        id: 'ea3d7eeedfe147259538e5ece3f25a3d'
                        key: {
                            name: 'x_1983_licutil_category'
                            element: 'count_mode'
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
                        table: 'sys_documentation'
                        id: 'eb319b05b1bd4dc5bee5293da284d8b7'
                        key: {
                            name: 'x_1983_licutil_category'
                            element: 'consumer_table'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'ec91332c50f4488cbd0e434a66a66e8c'
                        key: {
                            name: 'x_1983_licutil_category'
                            element: 'su_ratio'
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
