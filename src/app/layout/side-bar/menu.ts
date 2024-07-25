export const Menu = [
  {
    label: 'Dashboard',
    icon: 'nav-icon fas fa-tachometer-alt',
    class: 'nav-link active',
    show:true,
    subMenu: [
      {
        label: 'Dashboard1',
        url: 'stat',
        classa: 'nav-link',
        classi: 'far fa-circle nav-icon',
        show:true
      },
     /* {
        label: 'Dashboard2',
        url: 'stat',
        classa: 'nav-link',
        classi: 'far fa-circle nav-icon',
        show:true
      },*/
    ],
  },
  {
    label: 'wizard consulting',
    icon: 'fa fa-cog',
    class: 'nav-link ',
    show:true,
    subMenu: [
      {
        label: 'configuration',
        url: 'configuration',
        classa: 'nav-link',
        classi: 'far fa-circle nav-icon',
        show:true
      },
      {
        label: 'custom prep',
        url: 'prepData',
        classa: 'nav-link',
        classi: 'far fa-circle nav-icon',
        show:true
      },
      {
        label: 'visualisation',
        url: 'smartGrid',
        classa: 'nav-link',
        classi: 'far fa-circle nav-icon',
        show:true
      },
      {
        label: 'calculation',
        url: 'calcul-interf',
        classa: 'nav-link',
        classi: 'far fa-circle nav-icon',
        show:true
      },
      {
        label: 'Reports',
        url: 'report-interf',
        classa: 'nav-link',
        classi: 'far fa-circle nav-icon',
        show:true
      }
      ,
      {
        label: 'Share-Reports',
        url: 'share-report',
        classa: 'nav-link',
        classi: 'far fa-circle nav-icon',
        show:true
      },
      {
        label: 'Group-Descr',
        url: 'group-desc',
        classa: 'nav-link',
        classi: 'far fa-circle nav-icon',
        show:true
      },
      {
        label: 'Kpi-Descr',
        url: 'kpi-desc',
        classa: 'nav-link',
        classi: 'far fa-circle nav-icon',
        show:true
      },
      {
        label: 'DataSource-Descr',
        url: 'datasource-desc',
        classa: 'nav-link',
        classi: 'far fa-circle nav-icon',
        show:true
      }



    ],
  },
];
