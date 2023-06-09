/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const invEmpRouter = {
  path: '/employe-envoice',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Facturación Emp',
  alwaysShow: true, // will always show the root menu
  meta: {
    title: 'Facturación',
    icon: 'documentation',
    roles: ['admin', 'editor']
  },
  children: [
    {
      path: 'positions',
      component: () => import('@/views/invoice-employe/positions'),
      name: 'Positions',
      meta: { title: 'Puestos', noCache: true, icon: 'peoples', roles: ['admin'] }
    },
    {
      path: 'projects',
      component: () => import('@/views/invoice-employe/projects'),
      name: 'Projects',
      meta: { title: 'Proyectos', noCache: true, icon: 'el-icon-s-management', roles: ['admin'] }
    },
    {
      path: 'employes',
      component: () => import('@/views/invoice-employe/employes'),
      name: 'Employes',
      meta: { title: 'Colaboradores', noCache: true, icon: 'people', roles: ['admin'] }
    },
    {
      path: 'invoices-employes',
      component: () => import('@/views/invoice-employe/invoices-employes'),
      name: 'InvoicesEmployes',
      meta: { title: 'Facturas', noCache: true, icon: 'skill', roles: ['admin'] }
    },
    {
      path: 'upload-invoice',
      component: () => import('@/views/invoice-employe/upload-invoice'),
      name: 'UploadInvoice',
      meta: { title: 'Subir Factura', noCache: true, icon: 'el-icon-upload' }
    }
  ]
}
export default invEmpRouter
