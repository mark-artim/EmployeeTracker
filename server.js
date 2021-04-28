require('dotenv').config();
const inquirer = require('inquirer');
// const Connection = require('mysql2/typings/mysql/lib/Connection');
console.log("WELCOME TO EMPLOYEE TRACKER    Copyright 1978");
async function main() {
    // get the client
    const mysql = require('mysql2/promise');
    // create the connection
    return await mysql.createConnection({host:process.env.DB_HOST, user: process.env.DB_USER, database: process.env.DB_NAME, password: process.env.DB_PASS})
    // query database
     }
 
/**
 * GLOBAL VARIABLES
 */
 const menu = ["Employees - View All", "Employee - Add New", "Departments - View All", "Department - Add New", "Roles - View All", "Role - Add New", "Managers - View All", "Manager - Ad New", "Exit Program"];
 const prompts = [
     {
         name: 'menuChoice',
         type: 'list',
         message: 'What would you like to do?',
         choices: menu
     },
 ]
 
 // ADD ROLE INQUIRER
 const deptChoices = ["1", "2", "3"];
 const addRolPrompts = [
     {
         name: 'title',
         type: 'input',
         message: 'New role title?'
     },
     {
         name: 'salary',
         type: 'number',
         message: 'New role salary?'
     },
     {
         name: 'deptId',
         type: 'list',
         message: 'New role department?',
         choices: deptChoices
     }
 ]
 // ADD DEPARTMENT INQUIRER
 const addDepPrompts = [
     {
         name: 'deptName',
         type: 'input',
         message: 'New department name?'
     }
 ]
//RETRIEVE FUNCTIONS
//LIST ALL EMPLOYEES
async function listAllEmployees() {
    const connect = await main();
    console.log('>>>')
    var listAllEmployees = await connect.query('SELECT e.id, e.first_name, e.last_name, role.title, department.deptname, role.salary, CONCAT(m.first_name,\' \', m.last_name) AS \'Manager\' FROM employee e LEFT JOIN role ON role_id = role.id INNER JOIN department ON role.department_id = department.id INNER JOIN employee m ON e.manager_id = m.id');
    // console.table(listAllEmployees[0]);
    return listAllEmployees[0]
}
// LIST ALL ROLES
async function listAllRoles() {
    const connect = await main();
    var listAllRoles = await connect.query('SELECT * FROM role');
    // console.table(listAllRoles[0]);
    return(listAllRoles[0])
}
// LIST ALL DEPARTMENTS
async function listAllDepartments() {
    const connect = await main();
    var listAllDepartments = await connect.query('SELECT * FROM department');
    // console.table(listAllDepartments[0]);
    return(listAllDepartments[0])
}

// async function roleChoices2() {
//     const connect = await main();
//     var listAllRoles = await connect.query('SELECT * FROM role');
//     // console.log('listallroles: ',listAllRoles[0]);
//     // const arrayOfRoles = listAllRoles[0].map( e => e.title);
//     // const arrayOfRolesIds = listAllRoles[0].map( r => r.id);
//     // console.log('arrayOfRoles: ', arrayOfRoles);
//     // console.log('arrayOfRoleIds: ', arrayOfRolesIds);
//     // return(arrayOfRoles)
//     return(listAllRoles[0])
// }
// roleChoices2();

// LIST ALL MANAGERS
async function managerChoices2() {
    const connect = await main();
    var listAllManagers = await connect.query('SELECT e.id, CONCAT(e.first_name,\' \', e.last_name) AS \'Manager\', role.title, department.deptname, role.salary FROM employee e LEFT JOIN role ON role_id = role.id INNER JOIN department ON role.department_id = department.id WHERE e.manager_id IS NULL;');
    return(listAllManagers[0]);
}

// ADD FUNCTIONS
// ADD EMPLOYEE
async function addEmployee() {
    rolesArray = await listAllRoles();
    const roleChoices = rolesArray.map(r => r.title);
    managersArray = await managerChoices2();
    const managerChoices = managersArray.map(r => r.Manager);
    // console.log('>>>>roleChoices in add emp ',roleChoices)
    const addEmpPrompts = [
        {
            name: 'firstName',
            type: 'input',
            message: 'New employee first name?'
        },
        {
            name: 'lastName',
            type: 'input',
            message: 'New employee last name?'
        },
        {
            name: 'roleId',
            type: 'list',
            message: 'New employee Role?',
            choices: roleChoices
        },
        {
            name: 'managerId',
            type: 'list',
            message: 'New employee Manager?',
            choices: managerChoices
        },
    ]
    inquirer.prompt(addEmpPrompts)
        // .then(roleChoices2)
        .then(async(response) => {
            var newRoleID = (rolesArray.find(r => r.title == response.roleId)).id;
            // var newRoleID = 2;
            var newManagerID = managersArray.find(m => m.Manager == response.managerId).id;
            const connect = await main();
            const addEmp = await connect.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [response.firstName, response.lastName, newRoleID, newManagerID]);
            console.log('New employee record added.',addEmp);
            mainMenu();
        });     
        
        
        };
// addEmployee();

function addDepartment() {
    inquirer.prompt(addDepPrompts)
        .then((response) => {
            const addDep = connect.query('INSERT INTO department (deptname) VALUES (?)', [response.deptName]);
            console.log('New department record added.');
            mainMenu();
        });
}

function addRole() {
    inquirer.prompt(addRolPrompts)
        .then((response) => {
            const addRol = connect.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [response.title, response.salary, response.deptId]);
            console.log('New role record added.');
            mainMenu();
        });
}

function mainMenu() {
    inquirer.prompt(prompts)
        .then(async(response) => {
            switch (response.menuChoice) {
                case 'Employees - View All':
                    console.log(response.menuChoice);
                    var results = await listAllEmployees();
                    console.table(results);
                    mainMenu();
                    break;
                case 'Employee - Add New':
                    console.log(response.menuChoice);
                    addEmployee();
                    // mainMenu();
                    break;
                case 'Managers - View All':
                    console.log(response.menuChoice);
                    var results = await managerChoices2();
                    console.table(results);
                    mainMenu();
                    break;
                case 'Manager - Add New':
                    console.log(response.menuChoice);
                    addEmployee();
                    // mainMenu();
                    break;
                case 'Departments - View All':
                    console.log(response.menuChoice);
                    var results = await listAllDepartments();
                    console.table(results);
                    mainMenu();
                    break;
                case 'Department - Add New':
                    console.log(response.menuChoice);
                    addDepartment();
                    break;
                case 'Roles - View All':
                    console.log(response.menuChoice);
                    var results = await listAllRoles();
                    console.table(results)
                    mainMenu();
                    break;
                case 'Role - Add New':
                    console.log(response.menuChoice);
                    addRole();
                    break;
                case 'Exit Program':
                    console.log("Adios!");
                    process.exit(0);
                default:
                    console.log("You picked something that's not done yet.");
                    mainMenu();
            }
        });
};
mainMenu();

  //old
//   async function addEmployee() {
//     inquirer.prompt(addEmpPrompts)
//     .then((response) => {
//         const addEmp = connect.query('INSERT INTO employee (first_name, last_name, role_id, manager_id',[response.firstName, response.lastName, response.roleId, response.managerId]);
//         return; 
//     });                      
//     }

//var data = retrieveEmployees()
//console.log(retrieveEmployees())
// async function connection() {
//     try {
//         const connect = await mysql.createConnection({
//             host: 'localhost',
//             port: 3306,
//             user: 'root',
//             password: 'Gramshammer856!',
//             database: 'emptracker_db',
//         });
//         // async function listAllDepartments() {
//         //miserable Inquirer code:
//         // MAIN MENU INQUIRER
//         // console.log(listAllEmployees[0]);
//         //mainMenu();
//     }
//     catch (ex) {
//         console.log(ex)
//     }
// }

// }  

//DELETE THE FOLLOWING:
// async function findManagerId(fn,ln) {
//     const connect = await main();
//     // fn = 'Michael';
//     // ln = "Scott";
//     var managerId = await connect.query('SELECT id FROM employee WHERE ? AND ?',
//     [{
//         first_name: fn,
//     },
//     {
//         last_name: ln,
//     }]);

//     // console.table(managerId[0]);
//     console.log('findManagerId is ',managerId[0]);
//     return managerId[0]
// }
// findManagerId();
