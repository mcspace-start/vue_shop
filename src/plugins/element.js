import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css'

// import Element from 'element-ui'
import {
    Form,
    FormItem,
    Input,
    Button,
    Message,
    Container,
    Aside,
    Header,
    Main,
    Menu,
    MenuItem,
    Submenu,
    MenuItemGroup,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Row,
    Col,
    Table,
    TableColumn,
    Switch,
    Tooltip,
    Pagination,
    Dialog,
    MessageBox,
    Tag,
    Tree,
    Select,
    Option,
    Cascader
} from 'element-ui'

// Vue.use(Element)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Header)
Vue.use(Main)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)

// 在vue全局实例内定义 $message 挂载element Message组件
Vue.prototype.$message = Message
//在vue全局实例内定义 $confirm 挂载element MessageBox组件
Vue.prototype.$confirm = MessageBox.confirm
