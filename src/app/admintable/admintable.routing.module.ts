import { Routes } from "@angular/router";
import { Table1 } from "./table1/table1";
import { Table2 } from "./table2/table2";
import { Table3 } from "./table3/table3";
import { Table4 } from "./table4/table4";
import { Table5 } from "./table5/table5";
import { Table6 } from "./table6/table6";
import { Table7 } from "./table7/table7";
import { Table8 } from "./table8/table8";
import { Table9 } from "./table9/table9";
import { Table10 } from "./table10/table10";

const routes: Routes = [
    {
        path: 'table1', component: Table1
    },
    {
        path: 'table2', component: Table2
    },
    {
        path: 'table3', component: Table3
    },
    {
        path: 'table4', component: Table4
    },
    {
        path: 'table5', component: Table5
    },
    {
        path: 'table6', component: Table6
    },
    {
        path: 'table7', component: Table7
    },
    {
        path: 'table8', component: Table8
    },
    {
        path: 'table9', component: Table9
    },
    {
        path: 'table10', component: Table10
    }
];


export default routes;


