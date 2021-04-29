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
 
// GLOBAL VARIABLES
 const menu = ["Employees - View All", "Employee - Add New", "Employee - Modify", "Employee - Delete", "Departments - View All", "Departments - View Budget", "Department - Add New", "Department - Delete", "Roles - View All", "Role - Add New", "Managers - View All", "Manager - Ad New", "Exit Program"];
 const prompts = [
     {
         name: 'menuChoice',
         type: 'rawlist',
         message: 'What would you like to do?',
         choices: menu
     },
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
// LIST ALL EMPLOYEES
async function listAllEmployees() {
    const connect = await main();
    console.log('>>>')
    var listAllEmployees = await connect.query('SELECT e.id, CONCAT(e.first_name,\' \', e.last_name) AS \'Emp_Name\', role.title, department.deptname, role.salary, CONCAT(m.first_name,\' \', m.last_name) AS \'Manager\' FROM employee e LEFT JOIN role ON role_id = role.id INNER JOIN department ON role.department_id = department.id INNER JOIN employee m ON e.manager_id = m.id');
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
// LIST ALL MANAGERS
async function managerChoices2() {
    const connect = await main();
    var listAllManagers = await connect.query('SELECT e.id, CONCAT(e.first_name,\' \', e.last_name) AS \'Manager\', role.title, department.deptname, role.salary FROM employee e LEFT JOIN role ON role_id = role.id INNER JOIN department ON role.department_id = department.id WHERE e.manager_id IS NULL;');
    return(listAllManagers[0]);
}
// LIST BUDGET BY DEPARTMENT
async function listDeptBudget() {
    const connect = await main();
    var listBudget = await connect.query('SELECT department.deptname, CONCAT(\'$\',FORMAT(SUM(role.salary),0)) AS "Budget" FROM employee e LEFT JOIN role ON role_id = role.id INNER JOIN department ON role.department_id = department.id GROUP BY department.deptname;');
    // console.table(listAllRoles[0]);
    return(listBudget[0])
}

// ADD FUNCTIONS
// ADD EMPLOYEE
async function addEmployee() {
    rolesArray = await listAllRoles();
    const roleChoices = rolesArray.map(r => r.title);
    managersArray = await managerChoices2();
    const managerChoices = managersArray.map(r => r.Manager);
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
        .then(async(response) => {
            var newRoleID = (rolesArray.find(r => r.title == response.roleId)).id;
            var newManagerID = managersArray.find(m => m.Manager == response.managerId).id;
            const connect = await main();
            const addEmp = await connect.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [response.firstName, response.lastName, newRoleID, newManagerID]);
            console.log('New employee record added.',addEmp);
            mainMenu();
        });     
        };

// UPDATE EMPLOYEE ROLE OR MANAGER
async function updateEmployee() {
    updEmpArray = await listAllEmployees();
    const updEmpChoices = updEmpArray.map(e => e.Emp_Name);
    rolesArray = await listAllRoles();
    const roleChoices = rolesArray.map(r => r.title);
    managersArray = await managerChoices2();
    const managerChoices = managersArray.map(r => r.Manager);
    const updEmpPrompts = [
        {
            name: 'emp2Update',
            type: 'list',
            message: 'Select employee to modify:',
            choices: updEmpChoices
        },
        {
            name: 'updChoice',
            type: 'list',
            message: 'Do you want to modify employee Role or Manager?',
            choices: ["Role", "Manager"]
        },
        {
            name: 'newRoleChoice',
            type: 'list',
            message: 'Select new Role',
            choices: roleChoices,
            when: (answers => answers.updChoice === 'Role')
        },
        {
            name: 'newManagerChoice',
            type: 'list',
            message: 'Select new Manager',
            choices: managerChoices,
            when: (answers => answers.updChoice === 'Manager')
        },
    ]
    inquirer.prompt(updEmpPrompts)
        .then(async(response) => {
            var updateEmployeeID = updEmpArray.find(e => e.Emp_Name == response.emp2Update).id;
            if (response.updChoice == "Role") {
                var newRoleID = (rolesArray.find(r => r.title == response.newRoleChoice)).id;
                const connect = await main();
                const delEmp = await connect.query(
                'UPDATE employee SET ? WHERE ?',
                [
                    {
                        role_id: newRoleID,
                    },
                    {
                        id: updateEmployeeID,
                    },
                ],
                    (err, res) => {
                  if (err) throw err;
                  console.log(`${res.affectedRows} products updated!\n`);
                }
              );
            } else {
                var newManagerID = managersArray.find(m => m.Manager == response.newManagerChoice).id;
                const connect = await main();
                const delEmp = await connect.query(
                'UPDATE employee SET ? WHERE ?',
                [
                    {
                        manager_id: newManagerID,
                    },
                    {
                        id: updateEmployeeID,
                    },
                ],
                    (err, res) => {
                  if (err) throw err;
                  console.log(`${res.affectedRows} products updated!\n`);
                }
              );
            }
            mainMenu();
        });     
        };


// DELETE EMPLOYEE
async function deleteEmployee() {
    delEmpArray = await listAllEmployees();
    const delEmpChoices = delEmpArray.map(e => e.Emp_Name);
    const delEmpPrompts = [
        {
            name: 'emp2Delete',
            type: 'list',
            message: 'Select employee to delete. Be careful!',
            choices: delEmpChoices
        },
    ]
    inquirer.prompt(delEmpPrompts)
        .then(async(response) => {
            var deleteEmployeeID = delEmpArray.find(e => e.Emp_Name == response.emp2Delete).id;
            const connect = await main();

            const delEmp = await connect.query(
                'DELETE FROM employee WHERE ?',
                {
                  id: deleteEmployeeID,
                },
                (err, res) => {
                  if (err) throw err;
                  console.log(`${res.affectedRows} products deleted!\n`);
                }
              );
            mainMenu();
        });     
        };        

// ADD DEPARTMENT
async function addDepartment() {
    inquirer.prompt(addDepPrompts)
        .then(async(response) => {
            const connect = await main();
            const addDep = await connect.query('INSERT INTO department (deptname) VALUES (?)', [response.deptName]);
            console.log('New department record added.');
            mainMenu();
        });
}
// DELETE DEPARTMENT
async function deleteDept() {
    delDeptArray = await listAllDepartments();
    const delDeptChoices = delDeptArray.map(e => e.deptname);
    const delDeptPrompts = [
        {
            name: 'dept2Delete',
            type: 'list',
            message: 'Select Department to delete. Be careful!',
            choices: delDeptChoices
        },
    ]
    inquirer.prompt(delDeptPrompts)
        .then(async(response) => {
            var deleteDeptID = delDeptArray.find(e => e.deptname == response.dept2Delete).id;
            const connect = await main();
            const delEmp = await connect.query(
                'DELETE FROM department WHERE ?',
                {
                  id: deleteDeptID,
                },
                (err, res) => {
                  if (err) throw err;
                  console.log(`${res.affectedRows} deparmtnets deleted!\n`);
                }
              );
            mainMenu();
        });     
        };  

// ADD ROLE
async function addRole() {
    deptArray = await listAllDepartments();
    const deptChoices = deptArray.map(r => r.deptname);
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
    inquirer.prompt(addRolPrompts)
        .then(async(response) => {
            var newDeptID = (deptArray.find(d => d.deptname == response.deptId)).id;
            const connect = await main();
            const addRol = await connect.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [response.title, response.salary, newDeptID]);
            console.log('New role record added.');
            mainMenu();
        });
}
// THE MAIN MENU (INIT)
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
                    break;
                case 'Employee - Modify':
                    console.log(response.menuChoice);
                    updateEmployee();
                    break;
                case 'Employee - Delete':
                    console.log(response.menuChoice);
                    deleteEmployee();
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
                    break;
                case 'Departments - View All':
                    console.log(response.menuChoice);
                    var results = await listAllDepartments();
                    console.table(results);
                    mainMenu();
                    break;
                case 'Departments - View Budget':
                    console.log(response.menuChoice);
                    var results = await listDeptBudget();
                    console.table(results);
                    mainMenu();
                    break;
                case 'Department - Add New':
                    console.log(response.menuChoice);
                    addDepartment();
                    break;
                case 'Department - Delete':
                    console.log(response.menuChoice);
                    deleteDept();
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

console.log(" ___            _                    _____            _           ")
console.log("| __|_ __  _ __| |___ _  _ ___ ___  |_   _| _ __ _ __| |_____ _ _ ");
console.log("| _|| '  \\| '_ \\ / _ \\ || / -_) -_)   | || '_/ _` / _| / / -_) '_|");
console.log("|___|_|_|_| .__/_\\___/\\_, \\___\\___|   |_||_| \\__,_\\__|_\\_\\___|_|  ");
console.log("          |_|         |__/                                        ");

mainMenu();

  //old


// }  

//DELETE THE FOLLOWING:

// SAVE

// var listAllEmployees = await connect.query('SELECT e.id, e.first_name, e.last_name, role.title, department.deptname, role.salary, CONCAT(m.first_name,\' \', m.last_name) AS \'Manager\' FROM employee e LEFT JOIN role ON role_id = role.id INNER JOIN department ON role.department_id = department.id INNER JOIN employee m ON e.manager_id = m.id');