import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
// import Organisations from 'views/organizations';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const OrganizationDefault = Loadable(lazy(() => import('views/organizations')));
const OrganizationDetail = Loadable(lazy(() => import('views/organizations/OrganizationDetail')));
const DepartmentsDefault = Loadable(lazy(() => import('views/departments')));
const DepartmentsDetail = Loadable(lazy(() => import('views/departments/DepartmentDetail')));
const AddDepartments = Loadable(lazy(() => import('views/departments/AddDepartments')));
const Roles = Loadable(lazy(() => import('views/roles')));
const Users = Loadable(lazy(() => import('views/users')));
const AddUser = Loadable(lazy(() => import('views/users/AddUser')));
const StaffType = Loadable(lazy(() => import('views/StaffType')));
const Tier = Loadable(lazy(() => import('views/tier')));
const Designation = Loadable(lazy(() => import('views/designation')));
const LevelOfEmployee = Loadable(lazy(() => import('views/level_of_employee')));
const EmployeeDetail = Loadable(lazy(() => import('views/users/EmployeeDetail')));
const EditEmployee = Loadable(lazy(() => import('views/users/EditEmployee')));
const MatrixTemplate = Loadable(lazy(() => import('views/matrix_template')));
const ADDMatrixTemplate = Loadable(lazy(() => import('views/matrix_template/Add_Template')));
const TemplateDetail = Loadable(lazy(() => import('views/matrix_template/Template_detail')));
const FunctionDetail = Loadable(lazy(() => import('views/matrix_template/Function_detail')));
const AddSubFunction = Loadable(lazy(() => import('views/matrix_template/SubFunction/AddSubFunction.js')));


// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {

    path: '/admin',
    element: <MainLayout />,
    children: [
        {
            path: '/admin/dashboard',
            element: <DashboardDefault />
        },
        {
            path: '/admin/organizations',
            element: <OrganizationDefault />
        },
        {
            path: '/admin/organizations/organization_detail/:id',
            element: <OrganizationDetail />
        },
        {
            path: '/admin/departments',
            element: <DepartmentsDefault />
        },
        {
            path: '/admin/departments/add/:org_id',
            element: <AddDepartments />
        },
        {
            path: '/admin/departments/departmentDetail/:id',
            element: <DepartmentsDetail />
        },
        {
            path: '/admin/roles/',
            element: <Roles/>
        },
        {
            path: '/admin/staff_type/',
            element: <StaffType/>
        },
        {
            path: '/admin/tier/',
            element: <Tier/>
        },
        {
            path: '/admin/designation/',
            element: <Designation/>
        },
        {
            path: '/admin/level/',
            element: <LevelOfEmployee/>
        },
        {
            path: '/admin/users/',
            element: <Users/>
        },
        {
            path: '/admin/users/add',
            element: <AddUser/>
        },
        {
            path: '/admin/users/detail/:id',
            element: <EmployeeDetail/>
        },
        {
            path: '/admin/users/edit/:id',
            element: <EditEmployee/>
        },
        {
            path: '/admin/template/',
            element: <MatrixTemplate/>
        },
        {
            path: '/admin/add_template/',
            element: <ADDMatrixTemplate/>
        },
        {
            path: '/admin/add_sub_function/:parent_id/:template_id',
            element: <AddSubFunction/>
        },
        {
            path: '/admin/template/template_detail/:id',
            element: <TemplateDetail/>
        },
        {
            path: '/admin/template/function_detail/:id',
            element: <FunctionDetail/>
        },
        
    ]
};

export default MainRoutes;
