import {mapGetters, mapActions} from 'vuex';
import {quillEditor} from 'vue-quill-editor';
import _ from 'lodash';
import {formatDateParam} from '@/utils/common';

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
            editForm: {
                name: '',
                contacts: '',
                phone: '',
                effortDate: '',
                supplierId: '',
                description: 'TA很懒，什么都没留下~~~'
            },
            rules: {
                name: [
                    {required: true, message: '请输入订货单名', trigger: 'blur'}
                ],
                contacts: [
                    {required: true, message: '请输入联系人', trigger: 'blur'}
                ],
                phone: [
                    {required: true, message: '请输入手机号', trigger: 'blur'},
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
            dialogVisible: false,
            billEditing: {},
            usersLssAndPfs: [],
        }
    },

    components: {
        quillEditor
    },

    computed: {
        ...mapGetters(['currentUser'])
    },

    created() {
        this.initData();
    },

    methods: {
        ...mapActions([
            'loading',
            'getUserList',
            'getBillById',
            'updateBillById'
        ]),

        async initData() {
            this.loading(true);
            try {
                this.usersLssAndPfs = (await this.getUserList({
                    type1: 'lss',
                    type2: 'pfs'
                }))['users'];
                this.billEditing = await this.getBillById({
                    id: this.$route.params.id
                });
                this.editForm = _.extend({}, this.billEditing, {
                    supplierId: this.billEditing.supplier_id
                });
                this.$set(this.editForm, 'effortDate', this.billEditing['effort_date']);
            } catch(error) {
                console.error(error);
            }
            this.loading(false);
        },

        handleUpdate() {
            this.$refs['editForm'].validate(async (valid) => {
                if (valid) {
                    this.dialogVisible = true;
                } else {
                    this.$message({
                        type: 'error',
                        message: '请检查输入的信息'
                    });
                }
            });
        },

        handleCancelEdit() {
            this.billEditing = {};
            this.$router.push({name: 'billList'});

        },

        async handleConfirm() {
            this.dialogVisible = false;

            this.loading(true);
            let result = {};
            try {
                result = await this.updateBillById({
                    id: this.$route.params.id,
                    name: this.editForm.name,
                    contacts: this.editForm.contacts,
                    phone: this.editForm.phone,
                    effort_date: formatDateParam(this.editForm.effortDate),
                    description: this.editForm.description,
                    user_id: this.currentUser.id,
                    supplier_id: this.editForm.supplierId
                });
            } catch (error) {
                console.error(error);
            }
            this.loading(false);

            if (result.status === 'ok') {
                this.$message({
                    type: 'success',
                    message: `修改明细${this.billEditing.name}成功`
                });
                this.$router.push({name: 'billList'});
            }
        }
    },

    watch: {
        '$route'(to) {
            if (to.name === 'billEdit') {
                this.$refs['editForm'] && this.$refs['editForm'].resetFields();
                this.initData();
            }

        }
    }
}