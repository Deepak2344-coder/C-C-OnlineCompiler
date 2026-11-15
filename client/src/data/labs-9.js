/**
 * Lab Assignment 9 — C++ programs.
 * Abstract classes (pure virtual functions) and exception handling.
 * Edit this file to add / remove codes from this session.
 *
 * Each item: id, title, question, sampleInput, code, logic, concept, workflow, lang.
 * `lang` drives the compiler: "c" uses gcc, "cpp" uses g++.
 */
export const labs9 = [
  {
    id: "lab-9",
    name: "9 — Abstract Classes & Exception Handling",
    description:
      "Pure virtual functions and base-class polymorphism — a company payroll and a vehicle rental desk — then validating input with try/throw/catch and a user-defined exception.",
    items: [
      {
        id: "l9q1",
        title: "Abstract class — Employee payroll",
        question:
          "Create an abstract class Employee holding employee ID and name with a pure virtual calculateSalary(). A PermanentEmployee receives basic salary plus HRA (20%) and DA (10%); a ContractEmployee is paid by hours worked x hourly rate. Implement calculateSalary() in both derived classes and use a base-class pointer to display the salaries of both employee types.",
        sampleInput: "101\nAarav Sharma\n50000\n102\nRiya Verma\n200\n250",
        lang: "cpp",
        code: String.raw`#include <iostream>
#include <string>
using namespace std;

// a) Abstract class — id, name and a pure virtual calculateSalary()
class Employee {
protected:
    int id;
    string name;
public:
    Employee(int i, const string& n) : id(i), name(n) {}
    virtual ~Employee() {}                   // lets us delete through the base pointer

    virtual float calculateSalary() = 0;     // "= 0" makes Employee abstract

    void show() {
        cout << "Employee ID : " << id << endl;
        cout << "Name        : " << name << endl;
        cout << "Salary      : " << calculateSalary() << endl;
    }
};

// b) PermanentEmployee — basic + HRA (20%) + DA (10%)
class PermanentEmployee : public Employee {
private:
    float basic;
public:
    PermanentEmployee(int i, const string& n, float b) : Employee(i, n), basic(b) {}

    float calculateSalary() {
        float hra = 0.20f * basic;
        float da  = 0.10f * basic;
        return basic + hra + da;
    }
};

// b) ContractEmployee — hours worked x hourly rate
class ContractEmployee : public Employee {
private:
    float hours, rate;
public:
    ContractEmployee(int i, const string& n, float h, float r)
        : Employee(i, n), hours(h), rate(r) {}

    float calculateSalary() {
        return hours * rate;
    }
};

int main() {
    int id1, id2;
    string name1, name2;
    float basic, hours, rate;

    cout << "--- Permanent Employee ---" << endl;
    cout << "Enter employee ID  : ";
    cin >> id1;
    cin.ignore();                 // drop the newline left behind by >>
    cout << "Enter name         : ";
    getline(cin, name1);
    cout << "Enter basic salary : ";
    cin >> basic;

    cout << "\n--- Contract Employee ---" << endl;
    cout << "Enter employee ID  : ";
    cin >> id2;
    cin.ignore();
    cout << "Enter name         : ";
    getline(cin, name2);
    cout << "Enter hours worked : ";
    cin >> hours;
    cout << "Enter hourly rate  : ";
    cin >> rate;

    // c) base-class pointers — one per employee type
    Employee* p1 = new PermanentEmployee(id1, name1, basic);
    Employee* p2 = new ContractEmployee(id2, name2, hours, rate);

    cout << "\n=== Salary Report ===" << endl;
    p1->show();
    cout << endl;
    p2->show();

    delete p1;
    delete p2;
    return 0;
}
`,
        logic:
          "Employee stores the shared identity fields and declares calculateSalary() with '= 0', which makes the class abstract — it can be pointed at but never instantiated. Each derived class supplies its own body for that one function: PermanentEmployee adds 20% HRA and 10% DA to the basic salary, ContractEmployee multiplies hours by rate. Because show() lives in the base and calls the virtual calculateSalary(), a single call through Employee* reaches whichever derived version the object actually is.",
        concept:
          "Abstract classes and pure virtual functions (`virtual T f() = 0`), why an abstract class cannot be instantiated, inheritance as code reuse, overriding a virtual in each derived class, runtime polymorphism through a base-class pointer, `virtual` destructor for safe deletion through the base.",
        workflow:
          "1. declare `class Employee` with `virtual float calculateSalary() = 0` → 2. derive PermanentEmployee and ContractEmployee, each defining calculateSalary() → 3. read both employees' data → 4. build two `Employee*` pointers → 5. call show() on each, which dispatches to the right salary formula at runtime.",
      },
      {
        id: "l9q2",
        title: "Abstract class — Vehicle rental charges",
        question:
          "A vehicle rental company charges differently per vehicle type. Create an abstract class Vehicle with a pure virtual calculateRent(int days) and a virtual displayType(). Car costs number of days x Rs.2,000, Bike costs number of days x Rs.800, and Truck costs number of days x Rs.5,000 plus a fixed service charge of Rs.1,000. Override calculateRent() for each type and display the rental cost for 3 days using base-class pointers.",
        sampleInput: "3",
        lang: "cpp",
        code: String.raw`#include <iostream>
#include <string>
using namespace std;

// a) Abstract class Vehicle
class Vehicle {
protected:
    string type;
public:
    Vehicle(const string& t) : type(t) {}
    virtual ~Vehicle() {}

    virtual int calculateRent(int days) = 0;   // pure virtual — every type must define it
    virtual void displayType() {               // virtual, inherited unchanged
        cout << "Vehicle Type : " << type << endl;
    }
};

// b) Car — days x 2000
class Car : public Vehicle {
public:
    Car() : Vehicle("Car") {}
    int calculateRent(int days) { return days * 2000; }
};

// b) Bike — days x 800
class Bike : public Vehicle {
public:
    Bike() : Vehicle("Bike") {}
    int calculateRent(int days) { return days * 800; }
};

// b) Truck — days x 5000 plus a flat service charge of 1000
class Truck : public Vehicle {
public:
    Truck() : Vehicle("Truck") {}
    int calculateRent(int days) { return days * 5000 + 1000; }
};

int main() {
    int days;
    cout << "Enter number of rental days: ";
    cin >> days;

    // c) an array of base-class pointers, one per vehicle type
    Vehicle* fleet[3];
    fleet[0] = new Car();
    fleet[1] = new Bike();
    fleet[2] = new Truck();

    cout << "\nRental cost for " << days << " day(s):" << endl;
    for (int i = 0; i < 3; i++) {
        fleet[i]->displayType();
        cout << "Rent = Rs. " << fleet[i]->calculateRent(days) << endl << endl;
    }

    for (int i = 0; i < 3; i++) delete fleet[i];
    return 0;
}
`,
        logic:
          "Vehicle declares calculateRent(int days) as pure virtual, so it cannot exist as an object on its own, while displayType() already has a body that prints the stored type. Car, Bike and Truck each supply only their own pricing rule, so the rate table lives in one place per class rather than in a chain of conditionals. The loop walks an array of Vehicle* and calls calculateRent through it, and the dynamic type decides whether the 2000, 800 or 5000+1000 formula runs.",
        concept:
          "Abstract class with a pure virtual function plus an ordinary virtual function, overriding only what changes, an array of base-class pointers, runtime polymorphism choosing the implementation, adding a fixed charge to a per-day rate, why the loop needs no type checks.",
        workflow:
          "1. declare `class Vehicle` with `virtual int calculateRent(int days) = 0` → 2. derive Car, Bike and Truck, each overriding calculateRent() → 3. read the number of days → 4. fill `Vehicle* fleet[3]` with one object of each type → 5. loop over the array calling displayType() and calculateRent() through the pointer.",
      },
      {
        id: "l9q3",
        title: "Exception handling — bank withdrawal",
        question:
          "A bank processes customer withdrawals. Accept the account balance and the withdrawal amount. If the amount exceeds the available balance, throw one exception; if the amount is zero or negative, throw a different exception. Otherwise process the withdrawal and display the updated balance. Write the program with try, throw and catch, handling the two faults in separate exception handlers.",
        sampleInput: "10000\n4000",
        lang: "cpp",
        code: String.raw`#include <iostream>
using namespace std;

// b) Two different exception types, so each gets its own handler
class InsufficientBalance {
public:
    double balance, amount;
    InsufficientBalance(double b, double a) : balance(b), amount(a) {}
};

class InvalidAmount {
public:
    double amount;
    InvalidAmount(double a) : amount(a) {}
};

int main() {
    double balance, amount;

    cout << "Enter account balance   : ";
    cin >> balance;
    cout << "Enter withdrawal amount : ";
    cin >> amount;

    try {
        // a) different faults throw different exceptions
        if (amount <= 0)
            throw InvalidAmount(amount);

        if (amount > balance)
            throw InsufficientBalance(balance, amount);

        // c) nothing went wrong — process the transaction
        balance -= amount;
        cout << "\nWithdrawal processed successfully." << endl;
        cout << "Updated balance : " << balance << endl;
    }
    catch (const InvalidAmount& e) {
        cout << "\nInvalid withdrawal amount: " << e.amount
             << " - it must be greater than zero." << endl;
    }
    catch (const InsufficientBalance& e) {
        cout << "\nInsufficient balance: requested " << e.amount
             << " but only " << e.balance << " is available." << endl;
    }

    return 0;
}
`,
        logic:
          "The two bad cases are genuinely different errors, so they are modelled as two different types. Inside try, the amount is checked first for being non-positive and then for exceeding the balance; either one throws immediately and control jumps past the rest of the try block straight to the matching catch. Only when neither throw happens does the balance actually decrease, so the updated figure printed at the end is only ever reached on a valid transaction.",
        concept:
          "try / throw / catch, throwing objects rather than messages, one catch block per exception type and why the order matters, exceptions unwinding the stack to the handler, control skipping the remainder of the try block, keeping the happy path separate from validation.",
        workflow:
          "1. read balance and withdrawal amount → 2. enter `try` → 3. `amount <= 0` throws InvalidAmount → 4. `amount > balance` throws InsufficientBalance → 5. otherwise subtract and print the updated balance → 6. each `catch` prints a message for its own fault.",
      },
      {
        id: "l9q4",
        title: "User-defined exception — InvalidMarksException",
        question:
          "A college calculates a student's percentage from marks in three subjects, each of which must be between 0 and 100. Define a custom exception class InvalidMarksException and throw it when any mark is outside that range. When the marks are valid, calculate the percentage and assign the result: 75 and above Distinction, 60 to below 75 First Class, 40 to below 60 Pass, below 40 Fail.",
        sampleInput: "85 90 75",
        lang: "cpp",
        code: String.raw`#include <iostream>
#include <string>
using namespace std;

// a) user-defined exception class
class InvalidMarksException {
public:
    string message;
    InvalidMarksException(const string& m) : message(m) {}
};

int main() {
    int m1, m2, m3;

    cout << "Enter marks of three subjects (each 0-100): ";
    cin >> m1 >> m2 >> m3;

    try {
        // b) validate every mark, collecting the ones that are out of range
        string bad = "";
        if (m1 < 0 || m1 > 100) bad += " " + to_string(m1);
        if (m2 < 0 || m2 > 100) bad += " " + to_string(m2);
        if (m3 < 0 || m3 > 100) bad += " " + to_string(m3);

        if (!bad.empty())
            throw InvalidMarksException("out of range (0-100):" + bad);

        // c) marks are valid — percentage, then the grade band
        float percentage = (m1 + m2 + m3) / 3.0f;

        cout << "\nTotal      : " << (m1 + m2 + m3) << " / 300" << endl;
        cout << "Percentage : " << percentage << "%" << endl;

        if (percentage >= 75)
            cout << "Result     : Distinction" << endl;
        else if (percentage >= 60)
            cout << "Result     : First Class" << endl;
        else if (percentage >= 40)
            cout << "Result     : Pass" << endl;
        else
            cout << "Result     : Fail" << endl;
    }
    catch (const InvalidMarksException& e) {
        cout << "\nInvalidMarksException: " << e.message << endl;
    }

    return 0;
}
`,
        logic:
          "InvalidMarksException is an ordinary class carrying a message, which is what makes it throwable and catchable by name. Inside try the three marks are scanned first, and any value outside 0-100 is collected into a string that becomes the exception's message — the throw skips everything after it. Only clean marks reach the percentage, which is then tested against the four bands from the top down, so the first condition that matches decides the result.",
        concept:
          "Defining a custom exception class, throwing and catching a user-defined type by name, validating before computing, the `catch` matching the exact type thrown, percentage over three subjects, an if/else-if ladder evaluated in descending order.",
        workflow:
          "1. `class InvalidMarksException` holding a message → 2. read three marks → 3. enter `try` and scan each mark against 0-100 → 4. throw the exception naming the bad values → 5. otherwise compute the percentage → 6. walk the grade bands from Distinction down to Fail → 7. `catch` prints the exception's message.",
      },
    ],
  },
];
