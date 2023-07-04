// assets
import { IconDashboard,IconBuildingBank,IconBinaryTree2,IconUsers,IconBrandUbuntu,IconMilitaryRank,IconUserExclamation,IconStars,IconBrandApplePodcast } from '@tabler/icons';
import ListAltIcon from '@mui/icons-material/ListAlt';

// constant
const icons = { IconDashboard,IconBuildingBank,IconBinaryTree2,IconUsers,IconBrandUbuntu,IconMilitaryRank,IconUserExclamation,IconStars,IconBrandApplePodcast };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
    id: 'dashboard',
    title: 'Menu',
    type: 'group',
    children: [
        { 
            id: 'default',
            title: 'Dashboard',
            type: 'item',
            url: 'dashboard',
            icon: icons.IconDashboard,
            breadcrumbs: false
        },
        {
            id: 'organizations',
            title: 'Organisations',
            type: 'item',
            url: 'organizations',
            icon: IconBuildingBank,
            breadcrumbs: false
        },
        {
            id: 'departments',
            title: 'Departments',
            type: 'item',
            url: 'departments',
            icon: icons.IconBinaryTree2,
            breadcrumbs: false
        },
        
        {
            id: 'configuration',
            title: 'Configuration',
            type: 'collapse',
            icon: icons.IconDashboard,

            children: [
                {
                    id: 'roles',
                    title: 'Roles',
                    type: 'item',
                    url: 'roles',
                    icon: icons.IconBrandUbuntu,
                    breadcrumbs: false
                },
                {
                    id: 'staff_type',
                    title: 'Staff Type',
                    type: 'item',
                    url: 'staff_type',
                    icon: icons.IconUserExclamation,
                    
                    breadcrumbs: false
                },
                {
                    id: 'tier',
                    title: 'Tier',
                    type: 'item',
                    url: 'tier',
                    icon: icons.IconBrandApplePodcast,
                    breadcrumbs: false
                },
                {
                    id: 'designation',
                    title: 'Designation',
                    type: 'item',
                    url: 'designation',
                    icon: icons.IconStars,
                    breadcrumbs: false
                },
                
            ]
        },
        {
            id: 'employee',
            title: 'Employee',
            type: 'item',
            url: 'users',
            icon: icons.IconUsers,
            breadcrumbs: false
        },
        {
            id: 'matrix',
            title: 'Matrix Template',
            type: 'item',
            url: 'template',
            icon: icons.IconUsers,
            breadcrumbs: false
        }
        
    ]
};

export default dashboard;
