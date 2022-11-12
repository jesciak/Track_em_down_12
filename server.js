const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

const db = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'trojans',
    database: 'trackem_db'

});
db.connect(function (err) {
    if (err) throw err;
    start();
});
function start() {
    inquirer.prompt(
        {
            name: 'option',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'View All Employees',
                'Add Employee',
                'Update Employee Role',
                'View All Roles',
                'Add Role',
                'View All Departments',
                'Add Department',
                'Quit'
            ],
        })
        .then(function (answer) {
            switch (answer.option) {
                case 'View All Employees':
                    viewEmployees();
                    break;
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'Update Employee Role':
                    updateRole();
                case 'View All Roles':
                    viewRoles();
                case 'Add Role':
                    addRole();
                case 'View All Departments':
                    viewDepartments();
                case 'Add Department':
                    addDepartment();
                case 'Quit':
                    quit();
                    break;
            }
        })
}
function viewEmployees() {
    db.query('SELECT * FROM employee', function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
    })
}
function viewDepartments() {
    db.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    })
}
function addDepartment() {
    inquirer.prompt([
        {
            name: 'deptAdd',
            type: 'input',
            message: 'What is the name of the department?'
        }
    ])
        .then(function (answer) {
            db.query('INSERT INTO department (name) VALUES (?)', answer.deptAdd, function (err, res) {
                if (err) throw err;
                console.log(`Added ${answer.deptAdd} to the database`);
                console.table(res);
                start();
            })
        })
    }
function addEmployee() {
    db.query('SELECT * FROM role', function (err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                name: 'first_name',
                type: 'input',
                message: "What is the employee's first name?",
            },
            {
                name: 'last_name',
                type: 'input',
                message: "What is the employee's last name?",
            },
            {
                name: 'role',
                type: 'list',
                choices: function () {
                    let roleArray = [];
                    for (let i = 0; i < res.length; i++) {
                        roleArray.push(res[i].title);
                    }
                    return roleArray;
                },
                message: "What is the employee's role?"
            },
        ])
            .then(function (answer) {
                let roleId;
                for (let i = 0; i < res.length; i++) {
                    if (res[i].title == answer.role) {
                        roleId = res[i].id;
                    }
                }
                db.query('INSERT INTO employee SET ?',
                    {
                        first_name: answer.first_name,
                        last_name: answer.last_name,
                        role_id: roleId,
                    },
                    function (err) {
                        if (err) throw err;
                        console.log(`Added ${answer.first_name} ${answer.last_name} to the database as a ${answer.role}`);
                        start();
                    })
                })
        })
    }
function updateRole() {
    // var roleSelection = 'SELECT * FROM role;';
    // var deptSelection = 'SELECT * FROM department;';
    let newRole = {};

    db.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, e2.first_name AS manager FROM employee LEFT JOIN employee AS e2 ON e2.id= employee.manager_id JOIN role ON employee.role_id = role.id JOIN department ON role.department_id= department.id ORDER BY employee.id', function (err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                name: 'employeeChoice',
                type: 'list',
                choices: function () {
                    let choiceArray = [];
                    for (let i = 0; i < res.length; i++) {
                        choiceArray.push(res[i].first_name);
                    }
                    return choiceArray;
                },
                message: "Which employee's role do you want to update?",
            }
        ])
            .then(function (answer) {
                newRole.first_name = answer.employeeChoice;
                db.query('SELECT * FROM role', function (err, res) {
                    if (err) throw err;
                    inquirer.prompt([
                        {
                            name: 'updateRole',
                            type: 'list',
                            choices: function () {
                                let roleArray = [];
                                for (let i = 0; i < res.length; i++) {
                                    roleArray.push(res[i].title);
                                }
                                return roleArray;
                            },
                            message: "Which role do you want to assign the selected employee?"
                        }
                    ])
                        .then(function (answer) {
                            db.query('SELECT * FROM role WHERE title = ?', answer.updateRole, function (err, res) {
                                if (err) throw err;
                                newRole.role_id = res[0].id;
                                db.query('UPDATE employee SET role_id = ? WHERE first_name = ?', [newRole.role_id, newRole.first_name], function (err, res) {
                                    if (err) throw err;
                                    console.log("Updated employee's role successfully")
                                    start();
                                })
                            })
                        })
                })

            })
    })
}
function viewRoles() {
    db.query('SELECT * FROM role', function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });
};
function addRole() {
    let addedRole = {};
    db.query('SELECT * FROM department', function (err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                name: 'roleAdd',
                type: 'input',
                message: 'What is the name of the role?'
            },
            {
                name: 'salary',
                type: 'input',
                message: 'What is the salary of the role?'
            },
            {
                name: 'dept',
                type: 'list',
                choices: function () {
                    let deptArray = [];
                    for (let i = 0; i < res.length; i++) {
                        deptArray.push(res[i].name);
                    }
                    return deptArray;
                },
                message: "Which department does the role belong to?"
            }
        ])
            .then(function (answer) {
                addedRole.title = answer.roleAdd;
                addedRole.salary = answer.salary;

                db.query('SELECT id FROM department WHERE name = ?', answer.dept, function (err, res) {
                    if (err) throw err;
                    addedRole.department_id = res[0].id;
                    console.log(`Added ${answer.roleAdd} to the database`);
                    start();
                })

            })

    })
}

function quit() {
    db.end();
}