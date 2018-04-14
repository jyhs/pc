import {mapGetters, mapActions} from 'vuex';
import {quillEditor} from 'vue-quill-editor';
import {formatDateParam, toFormData} from '@/utils/common';
import {EXCEL_BASE_PATH} from '@/constants/index';

export default {
    data () {
        const validatePhone = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入手机号'));
            } else if (!/^1[23456789]\d{9}$/.test(value)) {
                callback(new Error('请输入正确的手机号!'));
            } else {
                callback();
            }
        };

        return {
            addForm: {
                billName: '',
                phone: '',
                effortDate: undefined,
                supplierId: '',
                description: 'TA很懒，什么都没留下~~~'
            },
            rules: {
                billName: [
                    {required: true, message: '请输入出货单名', trigger: 'blur'}
                ],
                phone: [
                    {required: true, message: '请输入供货商手机', trigger: 'blur'},
                    {validator: validatePhone, trigger: 'blur'}
                ],
                effortDate: [
                    {required: true, message: '请选择截止日期'},
                ],
                supplierId: [
                    {required: true, message: '请选择供货商'},
                ],
                description: [
                    {required: true, message: '请输入简介', trigger: 'blur'}
                ]
            },
            pickerOptions: {
                //只能选择大于等于今天的日期
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            editorOption: {
                placeholder: "请输入简介，支持html",
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],
                        [{'list': 'ordered'}, { 'list': 'bullet'}],
                        [{'header': [1, 2, 3, 4, 5, 6, false]}],
                        [{'color': []}, { 'background': []}],
                        [{'font': [] }],
                        [{'align': []}],
                        ['link'],
                        ['clean']
                    ]
                }
            },
            fileChangeDesc: '',
            usersPfs: [],
        }
    },

    components: {
        quillEditor
    },

    computed: {
        ...mapGetters(['currentUser', 'addedBill'])
    },

    created() {
        this.initData();
    },

    methods: {
        ...mapActions([
            'loading',
            'getUserList',
            'uploadBillFile',
            'updateAddedBillNameDate'
        ]),

        async initData() {
            this.fileChangeDesc = '';
            this.loading(true);
            try {
                this.usersPfs = (await this.getUserList({
                    type1: 'pfs',
                    size: 1000
                }))['users'];
            } catch(error) {
                console.error(error);
            }
            this.loading(false);
            this.addForm.effortDate = new Date((new Date() / 1000 + 86400 * 7) * 1000);
        },

        downloadTemplate() {
            try {
                const elemIFrame = document.createElement("iframe");
                elemIFrame.src = EXCEL_BASE_PATH;
                elemIFrame.style.display = "none";
                document.body.appendChild(elemIFrame);
            } catch (error) {
                console.error(error);
            }
        },

        handleSupplierChange(userId) {
            for (let user of this.usersPfs) {
                if (userId === user.id) {
                    this.addForm.phone = user.phone;
                    break;
                }
            }
        },

        handleFillChange() {
            const file = this.$refs['billFile'].files[0];
            if (file) {
                const fileName = file.name;
                if (/\.(xls|xlsx)$/.test(fileName)) {
                    this.fileChangeDesc = fileName;
                } else {
                    this.$notify.error({
                        title: '错误',
                        message: '只支持xls、xlsx文件的上传',
                        offset: 100
                    });
                }
            } else {
                this.fileChangeDesc = '您尚未选择上传的文件';
            }
        },

        async submitUpload() {
            this.$refs['addForm'].validate(async (valid) => {
                if (valid) {
                    const file = this.$refs['billFile'].files[0];

                    if (!file) {
                        this.$notify.error({
                            title: '错误',
                            message: '您尚未选择上传的文件',
                            offset: 100
                        });
                        return false;
                    } else {
                        if (!/\.(xls|xlsx)$/.test(file.name)) {
                            this.$notify.error({
                                title: '错误',
                                message: '只支持xls、xlsx文件的上传',
                                offset: 100
                            });
                        }
                    }

                    this.loading(true);
                    let result = {};
                    try {
                        result = await this.uploadBillFile(toFormData({
                            bill_name: this.addForm.billName,
                            bill: file,
                            contacts: this.currentUser.name,
                            phone: this.addForm.phone,
                            effort_date: formatDateParam(this.addForm.effortDate),
                            description: this.addForm.description,
                            user_id: this.currentUser.id,
                            supplier_id: this.addForm.supplierId
                        }));
                    } catch (error) {
                        console.error(error);
                    }
                    this.loading(false);

                    if (result.status === 'ok') {
                        this.$message({
                            type: 'success',
                            message: `上传出货单${this.addForm.billName}成功`
                        });
                        this.$router.push({name: 'billList'});
                    }
                } else {
                    this.$notify.error({
                        title: '错误',
                        message: '请检查输入是否正确',
                        offset: 100
                    });
                    return false;
                }
            });
        },

        async submitUploadBySeller() {
            this.$refs['addForm'].validate(async (valid) => {
                if (valid) {
                    const file = this.$refs['billFile'].files[0];

                    if (!file) {
                        this.$notify.error({
                            title: '错误',
                            message: '您尚未选择上传的文件',
                            offset: 100
                        });
                        return false;
                    } else {
                        if (!/\.(xls|xlsx)$/.test(file.name)) {
                            this.$notify.error({
                                title: '错误',
                                message: '只支持xls、xlsx文件的上传',
                                offset: 100
                            });
                        }
                    }

                    this.loading(true);
                    let result = {};
                    try {
                        result = await this.uploadBillFile(toFormData({
                            bill_name: this.addForm.billName,
                            bill: file,
                            contacts: this.currentUser.name,
                            phone: this.addForm.phone,
                            effort_date: formatDateParam(this.addForm.effortDate),
                            description: this.addForm.description,
                            user_id: this.currentUser.id,
                            supplier_id: this.addForm.supplierId,
                            is_one_step: 1,
                        }));
                    } catch (error) {
                        console.error(error);
                    }
                    this.loading(false);

                    if (result.status === 'ok') {
                        this.updateAddedBillNameDate({
                            billName: this.addForm.billName,
                            effortDate: this.addForm.effortDate
                        });
                        this.$message({
                            type: 'success',
                            message: `${this.addForm.billName}一键开团成功`
                        });
                        this.$router.push({
                            name: 'groupAdd',
                            params: {
                                id: result.bill_id
                            }
                        });
                    }
                } else {
                    this.$notify.error({
                        title: '错误',
                        message: '请检查输入是否正确',
                        offset: 100
                    });
                    return false;
                }
            });
        }
    },

    watch: {
        '$route'(to) {
            if (to.name === 'billAdd') {
                this.$refs['addForm'] && this.$refs['addForm'].resetFields();
                this.initData();
            }
        },
    }
}
