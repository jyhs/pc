webpackJsonp([38],{1040:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"bill-list-container"},[n("el-card",{staticClass:"card-container"},[n("div",{staticClass:"card-header clear-fix",attrs:{slot:"header"},slot:"header"},[n("el-row",{staticStyle:{width:"100%"}},[n("el-col",{attrs:{xs:24,sm:24,md:8,lg:8}},[n("div",{staticStyle:{"line-height":"36px"}},[n("el-icon",{staticClass:"el-icon-coral-list"}),t._v(" "),n("span",{staticClass:"card-title"},[t._v("出单列表")])],1)]),t._v(" "),n("el-col",{attrs:{xs:24,sm:24,md:16,lg:16}},[n("el-form",{ref:"searchForm",staticClass:"clear",attrs:{model:t.searchForm}},[n("el-form-item",{staticClass:"left",attrs:{label:"按出单名查找","label-width":"100px"}},[n("el-input",{model:{value:t.searchForm.name,callback:function(e){t.$set(t.searchForm,"name",e)},expression:"searchForm.name"}})],1),t._v(" "),n("el-form-item",{staticClass:"left",staticStyle:{"margin-left":"20px"}},[n("el-button",{attrs:{type:"primary",icon:"search"},on:{click:t.handleSearch}},[t._v("查询")]),t._v(" "),n("el-button",{attrs:{type:"primary",icon:"coral-refresh"},on:{click:t.handleReset}},[t._v("重置")])],1)],1)],1)],1)],1),t._v(" "),n("el-row",[n("el-col",{attrs:{span:24}},[n("div",{staticClass:"table-responsive"},[n("table",{staticClass:"table table-striped"},[n("thead",[n("tr",[n("th",[t._v("出单名")]),t._v(" "),n("th",[t._v("上传人")]),t._v(" "),n("th",[t._v("供货商")]),t._v(" "),n("th",[t._v("供货商手机")]),t._v(" "),n("th",[t._v("截止日期")]),t._v(" "),"tggly"===t.currentUser.type||"cjyy"===t.currentUser.type?n("th",{staticClass:"action-th"},[t._v("操作")]):t._e()])]),t._v(" "),n("tbody",t._l(t.billList,function(e){return n("tr",{key:e.id},[n("td",[n("a",{attrs:{href:"javascript: void (0)"},on:{click:function(n){t.handleActions(e,"billDetail")}}},[t._v("\n                                        "+t._s(e.name)+"\n                                    ")])]),t._v(" "),n("td",[t._v(t._s(e.contacts))]),t._v(" "),n("td",[t._v(t._s(e.supplier_name))]),t._v(" "),n("td",[t._v(t._s(e.phone))]),t._v(" "),n("td",[t._v(t._s(e.effort_date))]),t._v(" "),"tggly"===t.currentUser.type||"cjyy"===t.currentUser.type?n("td",{attrs:{align:"center"}},[n("el-button",{attrs:{title:"我要开团",type:"primary",size:"small",icon:"coral-add"},on:{click:function(n){t.handleActions(e,"groupAdd")}}}),t._v(" "),n("el-button",{attrs:{title:"明细",type:"primary",size:"small",icon:"coral-list"},on:{click:function(n){t.handleActions(e,"detailList")}}}),t._v(" "),n("el-button",{attrs:{title:"编辑",type:"primary",size:"small",icon:"edit"},on:{click:function(n){t.handleActions(e,"billEdit")}}}),t._v(" "),n("el-button",{attrs:{title:"删除",type:"primary",size:"small",icon:"delete"},on:{click:function(n){t.handleActions(e,"delete")}}})],1):t._e()])}))])])])],1),t._v(" "),n("div",{staticClass:"pagination"},[n("el-pagination",{attrs:{"current-page":t.page,"page-sizes":[10,20,30,40],"page-size":t.size,layout:"total, sizes, prev, pager, next, jumper",total:t.totalCount},on:{"size-change":t.handleSizeChange,"current-change":t.handleCurrentChange}})],1)],1),t._v(" "),n("el-dialog",{attrs:{title:"提示",size:"tiny",visible:t.dialogVisible,"before-close":t.handleCancel},on:{"update:visible":function(e){t.dialogVisible=e}}},[n("span",[t._v("你确定删除出货单"+t._s(t.currentRow.name)+"？")]),t._v(" "),n("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[n("el-button",{attrs:{type:"primary"},on:{click:t.handleConfirm}},[t._v("确定")]),t._v(" "),n("el-button",{on:{click:t.handleCancel}},[t._v("取消")])],1)])],1)},staticRenderFns:[]}},562:function(t,e,n){n(970);var i=n(223)(n(803),n(1040),null,null);t.exports=i.exports},803:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n(58),a=n.n(i),r=n(57),l=n.n(r),s=n(99),c=n.n(s),o=n(224);e.default={data:function(){return{searchForm:{name:""},billList:[],totalCount:0,currentRow:{},page:1,size:10,dialogVisible:!1,usersLssAndPfs:[]}},computed:c()({},n.i(o.b)(["currentUser"])),created:function(){var t=this;return l()(a.a.mark(function e(){return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:t.initData();case 1:case"end":return e.stop()}},e,t)}))()},methods:c()({},n.i(o.c)(["loading","getUserList","getBillList","deleteBillByIdAndUserId"]),{initData:function(t){var e=this;return l()(a.a.mark(function n(){var i;return a.a.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return e.loading(!0),i=[],n.prev=2,n.next=5,e.getBillList({name:t,page:e.page,size:e.size});case 5:return i=n.sent,n.next=8,e.getUserList({type1:"lss",type2:"pfs"});case 8:e.usersLssAndPfs=n.sent.users,n.next=14;break;case 11:n.prev=11,n.t0=n.catch(2),console.error(n.t0);case 14:e.loading(!1),e.billList=i.bills||[],e.totalCount=i.count?i.count[0].count:0;case 17:case"end":return n.stop()}},n,e,[[2,11]])}))()},handleSearch:function(){var t=this;this.$refs.searchForm.validate(function(e){e&&t.initData(t.searchForm.name)})},handleReset:function(){this.searchForm.name="",this.initData()},handleSizeChange:function(t){this.size=t,this.initData(this.searchForm.name)},handleCurrentChange:function(t){this.page=t,this.initData(this.searchForm.name)},handleActions:function(t,e){switch(e){case"detailList":case"billEdit":case"billDetail":case"groupAdd":this.$router.push({name:e,params:{id:t.id}});break;case"delete":this.currentRow=t,this.dialogVisible=!0}},handleCancel:function(){this.currentRow={},this.dialogVisible=!1},handleConfirm:function(){var t=this;return l()(a.a.mark(function e(){var n;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t.dialogVisible=!1,t.loading(!0),n={},e.prev=3,e.next=6,t.deleteBillByIdAndUserId({id:t.currentRow.id,user_id:t.currentUser.id});case 6:n=e.sent,e.next=12;break;case 9:e.prev=9,e.t0=e.catch(3),console.error(e.t0);case 12:t.loading(!1),"ok"===n.status&&(t.$message({type:"success",message:"删除出货单"+t.currentRow.name+"成功"}),t.initData());case 14:case"end":return e.stop()}},e,t,[[3,9]])}))()}}),watch:{$route:function(t){"billList"===t.name&&this.initData()}}}},865:function(t,e,n){e=t.exports=n(556)(!1),e.push([t.i,".bill-list-container{padding:10px}.bill-list-container .card-container a{text-decoration:none;cursor:pointer}.bill-list-container .card-container a:hover{cursor:pointer}.bill-list-container .card-container .el-card__header{padding:10px 20px}.bill-list-container .card-container .el-card__body{padding:10px}.bill-list-container .card-container .el-button{background:transparent;border:none}.bill-list-container .card-container .el-button i,.bill-list-container .card-container .el-button span{color:#20a0ff}.bill-list-container .card-container .el-button:focus,.bill-list-container .card-container .el-button:hover{background:#20a0ff}.bill-list-container .card-container .el-button:focus i,.bill-list-container .card-container .el-button:focus span,.bill-list-container .card-container .el-button:hover i,.bill-list-container .card-container .el-button:hover span{color:#fff}.bill-list-container .card-container .el-button.is-disabled{background:transparent}.bill-list-container .card-container .el-button.is-disabled i,.bill-list-container .card-container .el-button.is-disabled span{color:#bfcbd9}.bill-list-container .card-container .el-button.is-disabled:focus,.bill-list-container .card-container .el-button.is-disabled:hover{background:transparent}.bill-list-container .card-container .el-button.is-disabled:focus i,.bill-list-container .card-container .el-button.is-disabled:focus span,.bill-list-container .card-container .el-button.is-disabled:hover i,.bill-list-container .card-container .el-button.is-disabled:hover span{color:#bfcbd9}.bill-list-container .card-container .table td{vertical-align:middle;padding:4px}.bill-list-container .card-container .table .action-th{text-align:center}.bill-list-container .card-container .card-header{display:-ms-flexbox;display:flex;-ms-flex-direction:row;flex-direction:row;-ms-flex-pack:justify;justify-content:space-between}.bill-list-container .card-container .card-header i{font-size:16px}.bill-list-container .card-container .card-header .card-title{line-height:36px;font-size:16px;font-weight:700}.bill-list-container .card-container .card-header .el-form-item{margin-bottom:0}.bill-list-container .card-container .pagination{float:right;text-align:left;margin-top:10px}@media screen and (max-width:992px){.bill-list-container .card-container .el-pagination__jump,.bill-list-container .card-container .el-pagination__sizes,.bill-list-container .card-container .el-pagination__total{display:none}}",""])},970:function(t,e,n){var i=n(865);"string"==typeof i&&(i=[[t.i,i,""]]),i.locals&&(t.exports=i.locals);n(557)("5d32bd76",i,!0)}});