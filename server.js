// const env = require('.env');
const inquirer = require('inquirer');
const mysql = require('mysql2/promise');
// const employeee = require('./modules/employee');
// const Connection = require('mysql2/typings/mysql/lib/Connection');
// var roleChoices = '';

connection();

async function connection() {
    try {
        const connect = await mysql.createConnection({
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: 'Gramshammer856!',
            database: 'emptracker_db',
          });

        var listAllEmployees = await connect.query('SELECT * FROM employee');
        async function listAllDepartments() {
            var allDepts = await connect.query('SELECT * FROM department');
            return allDepts
        };
        var listAllRoles = await connect.query('SELECT * FROM role');
        console.log("Roles: " + listAllRoles[0]);
        const testRoles = await connect.query('SELECT JSON_ARRAYAGG(title) AS "roles" FROM role');
        var testRoles2 = Object.values(JSON.parse(JSON.stringify(testRoles)));
        console.log("testRoles: "+testRoles[0]);
        var roleChoices = testRoles2[0].roles;
        console.log("roleChocies: "+roleChoices);

        //miserable fucking Inquirer code:
        // MAIN MENU INQUIRER
        const menu = ["View All Employees","Add Employee","View All Departments","Add a Department","View All Roles","Add a Role","View All Managers","Exit Program"];
        const prompts = [
        {
            name: 'menuChoice',
            type: 'list',
            message: 'What would you like to do?',
            choices: menu
        },
        ]    
        // ADD EMPLOYEE INQUIRER
        // const roleChoices = ["1","2","3"];
        const managerChoices = ["1","2 - Dont pick me!"];
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
        // ADD ROLE INQUIRER
        const deptChoices = ["1","2","3"];
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
        async function getRoles() {
            const deptChoices2 = await connect.query('SELECT deptname FROM department');
            deptChoices = [];
            console.log(deptChoices2[0]);
            deptChoices2.forEach(addChoice)
            function addChoice() {
                deptChoices.push(deptChoices2[0].TextRow.deptName);
                console.log("fuckoff: "+deptChoices);
            }
        }
        // }  


        function addEmployee() {
            inquirer.prompt(addEmpPrompts)
            .then((response) => {
                const addEmp = connect.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',[response.firstName, response.lastName, response.roleId, response.managerId]);
                console.log('New employee record added.');
                mainMenu(); 
            });                      
        };

        function addDepartment() {
            inquirer.prompt(addDepPrompts)
            .then((response) => {
                const addDep = connect.query('INSERT INTO department (deptname) VALUES (?)',[response.deptName]);
                console.log('New department record added.');
                mainMenu(); 
            });                      
        }

        function addRole() {
            inquirer.prompt(addRolPrompts)
            .then((response) => {
                const addRol = connect.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)',[response.title, response.salary, response.deptId]);
                console.log('New role record added.');
                mainMenu(); 
            });                      
        }

        // console.log(listAllEmployees[0]);
        mainMenu();

        function mainMenu() {
            inquirer.prompt(prompts)
            .then((response) => {
                switch (response.menuChoice) {
                    case 'View All Employees':
                        console.log(response.menuChoice);
                        console.table(listAllEmployees[0]);
                        // listAllEmployees();
                        // console.table(result);
                        mainMenu();
                        break;
                    case 'Add Employee':
                        console.log(response.menuChoice);
                        addEmployee();
                        // employeee.connectionEmp();
                        break;
                    case 'View All Departments':
                        console.log(response.menuChoice);
                        console.table(listAllDepartments());
                        mainMenu();
                        break;
                    case 'Add a Department':
                        console.log(response.menuChoice);
                        addDepartment();
                        break;
                    case 'View All Roles':
                        console.log(response.menuChoice);
                        console.table(listAllRoles[0]);
                        mainMenu();
                        break;
                    case 'Add a Role':
                        console.log(response.menuChoice);
                        console.log(testRoles3[0].roles);
                        // addDepartment();
                    break;
                    case 'Exit Program':
                        console.log("Adios!");
                        console.log(employeee.empTest1());
                        console.log(employeee.empTest2())
                        return;
                        break;
                    default:
                    console.log("You picked something that's not done yet.");
                    mainMenu();
                }
            });
        };

    }
    catch(ex) {
        console.log(ex)
    }
}

  
//   const afterConnection2 = () => {
//       connection.query('SELECT * FROM employee WHERE last_name ="Halpert"', (err, res) => {
//         if (err) throw err;
//         console.table(res);
//         connection.end();
//       });
//     };


    




  //old
//   async function addEmployee() {
//     inquirer.prompt(addEmpPrompts)
//     .then((response) => {
//         const addEmp = connect.query('INSERT INTO employee (first_name, last_name, role_id, manager_id',[response.firstName, response.lastName, response.roleId, response.managerId]);
//         return; 
//     });                      
//     }