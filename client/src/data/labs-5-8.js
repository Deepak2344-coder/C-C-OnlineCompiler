/**
 * Lab Assignments 5, 6, 7 and 8 — C++ programs.
 * Edit this file to add / remove codes from these four sessions.
 *
 * Each item: id, title, question, sampleInput, code, logic, concept, workflow, lang.
 * `lang` drives the compiler: "c" uses gcc, "cpp" uses g++.
 */
export const labs58 = [
  {
    id: "lab-5",
    name: "5 — Static Members & Friend Functions",
    description:
      "Class-level data shared by every object, static counters and setters, plus granting external functions access to private members.",
    items: [
      {
        id: "l5q1",
        title: "Car class with a static counter",
        question:
          "Define a class Car with a static data member totalCars and a static function showTotal(). Increment the counter in the constructor and report how many Car objects were created.",
        lang: "cpp",
        code: String.raw`#include <iostream>
#include <string>
using namespace std;

class Car {
private:
    string model;
    double price;
    static int totalCars;          // static data member (shared by all objects)

public:
    // Parameterized constructor
    Car(string m, double p) {
        model = m;
        price = p;
        totalCars++;               // every time a Car is created, count increases
        cout << "Car created: " << model << endl;
    }

    void display() {
        cout << "Model: " << model << ", Price: Rs " << price << endl;
    }

    // Static member function
    static void showTotal() {
        cout << "\nTotal number of Car objects created = " << totalCars << endl;
    }
};

// Definition of static member (must be done outside the class)
int Car::totalCars = 0;

int main() {
    Car c1("Honda City", 1200000);
    Car c2("Toyota Innova", 1800000);
    Car c3("Tata Nexon", 950000);

    c1.display();
    c2.display();
    c3.display();

    // Calling static function using class name (preferred way)
    Car::showTotal();

    return 0;
}
`,
        logic:
          "totalCars belongs to the class rather than to any object, so there is exactly one copy no matter how many Cars exist. Every constructor run increments that single copy, and showTotal() simply reads it back — which is why it is called through Car:: and never through an object.",
        concept:
          "static data member as class-level (not object-level) state, the mandatory out-of-class definition `int Car::totalCars = 0;`, static member functions that can access only static members, calling them with Class::function().",
        workflow:
          "1. Declare `static int totalCars` → 2. define it outside the class as 0 → 3. constructor increments it → 4. build three Cars → 5. Car::showTotal() prints the shared count.",
      },
      {
        id: "l5q2",
        title: "BankAccount with a shared interest rate",
        question:
          "Define a class BankAccount with a static interestRate that is common to every account, and a static setInterestRate() that changes it for all existing and future accounts at once.",
        lang: "cpp",
        code: String.raw`#include <iostream>
#include <string>
using namespace std;

class BankAccount {
private:
    string holder;
    double balance;
    static double interestRate;    // same for all accounts

public:
    // Parameterized constructor
    BankAccount(string h, double b) {
        holder = h;
        balance = b;
        cout << "Account created for " << holder << endl;
    }

    void display() {
        cout << "Holder: " << holder
             << ", Balance: Rs " << balance
             << ", Interest Rate: " << interestRate << "%" << endl;
    }

    // Static function to change the common interest rate
    static void setInterestRate(double rate) {
        interestRate = rate;
        cout << "\nInterest rate changed to " << interestRate << "% for all accounts\n";
    }
};

// Definition + initialization of static member
double BankAccount::interestRate = 4.5;   // default 4.5%

int main() {
    BankAccount a1("Rahul Sharma", 50000);
    BankAccount a2("Sneha Patel", 75000);

    cout << "\n----- Before changing interest rate -----" << endl;
    a1.display();
    a2.display();

    // Change interest rate for ALL accounts using static function
    BankAccount::setInterestRate(6.0);

    cout << "\n----- After changing interest rate -----" << endl;
    a1.display();
    a2.display();

    return 0;
}
`,
        logic:
          "Interest rate is configuration shared by every account, so it lives in one static slot initialised to 4.5. setInterestRate() overwrites that single slot; when both accounts are displayed afterwards they both read 6.0 — nothing was written to a1 or a2 individually, the shared value simply changed.",
        concept:
          "Static members for shared configuration data, out-of-class initialisation to a default, a static setter as the only legitimate way to modify a private static member, one write affecting many reads.",
        workflow:
          "1. declare `static double interestRate` → 2. initialise it to 4.5 outside the class → 3. create two accounts → 4. display both → 5. BankAccount::setInterestRate(6.0) → 6. display both again.",
      },
      {
        id: "l5q3",
        title: "Auto-incrementing employee IDs",
        question:
          "Define a class Employee with a static nextId that starts at 1001. The parameterized constructor should assign each new employee a unique ID automatically and then advance the counter.",
        lang: "cpp",
        code: String.raw`#include <iostream>
#include <string>
using namespace std;

class Employee {
private:
    int empId;
    string name;
    double salary;
    static int nextId;             // starts from 1001 and keeps increasing

public:
    // Parameterized constructor – auto-assigns ID
    Employee(string n, double s) {
        empId = nextId;            // take current value
        nextId++;                  // prepare for the next employee
        name = n;
        salary = s;
        cout << "Employee created with ID: " << empId << endl;
    }

    void display() {
        cout << "ID: " << empId
             << ", Name: " << name
             << ", Salary: Rs " << salary << endl;
    }
};

// Initialize static member
int Employee::nextId = 1001;

int main() {
    Employee e1("Amit Kumar", 45000);
    Employee e2("Neha Gupta", 52000);
    Employee e3("Vikram Singh", 48000);

    cout << "\n----- Employee Details -----" << endl;
    e1.display();
    e2.display();
    e3.display();

    return 0;
}
`,
        logic:
          "nextId is a single shared counter seeded to 1001. Each constructor first copies the current value into the object's private empId and only then increments the counter — so the object takes 1001, the counter becomes 1002, and the next object takes 1002. The order of those two lines is what guarantees uniqueness.",
        concept:
          "The classic static-counter ID generator, read-then-increment sequencing inside a constructor, encapsulating assignment so callers never choose their own ID, static state persisting across constructor calls.",
        workflow:
          "1. seed `static int nextId = 1001` outside the class → 2. constructor: empId = nextId → 3. nextId++ → 4. store name/salary → 5. each of the three employees gets 1001, 1002, 1003.",
      },
      {
        id: "l5q4",
        title: "Friend function comparing two students",
        question:
          "Define a class Student with private name and marks, and a friend function compareMarks(s1, s2) that reports which of the two students scored higher — without using any member function.",
        lang: "cpp",
        code: String.raw`#include <iostream>
#include <string>
using namespace std;

class Student {
private:
    string name;
    float marks;

public:
    Student(string n, float m) {
        name = n;
        marks = m;
    }

    void display() {
        cout << name << " scored " << marks << endl;
    }

    // Friend function declaration
    friend void compareMarks(Student s1, Student s2);
};

// Friend function definition (it is NOT a member of the class)
void compareMarks(Student s1, Student s2) {
    cout << "\nComparing marks...\n";
    if (s1.marks > s2.marks) {
        cout << s1.name << " has higher marks (" << s1.marks << ")" << endl;
    }
    else if (s2.marks > s1.marks) {
        cout << s2.name << " has higher marks (" << s2.marks << ")" << endl;
    }
    else {
        cout << "Both have equal marks." << endl;
    }
}

int main() {
    Student st1("Ananya", 88.5);
    Student st2("Rohan", 92.0);

    st1.display();
    st2.display();

    // Calling the friend function
    compareMarks(st1, st2);

    return 0;
}
`,
        logic:
          "marks and name are private, so a free function would normally be blocked from reading them. Declaring compareMarks as a friend inside the class grants it access, and since it receives both students it can compare s1.marks against s2.marks directly and pick one of three outcomes: first higher, second higher, or equal.",
        concept:
          "The friend keyword granting a non-member function access to private members, friend declared inside the class but defined outside it, why a friend has no `this` pointer and never uses the dot operator, comparison as a two-object operation.",
        workflow:
          "1. declare `friend void compareMarks(Student, Student)` → 2. define the free function → 3. build two students → 4. call compareMarks(st1, st2) → 5. print the higher, or equal.",
      },
      {
        id: "l5q5",
        title: "Friend function computing total salary",
        question:
          "Define a class Employee with private basic and bonus, and a friend function calculateTotalSalary(e) that adds them and prints the payroll summary.",
        lang: "cpp",
        code: String.raw`#include <iostream>
#include <string>
using namespace std;

class Employee {
private:
    string name;
    double basic;
    double bonus;

public:
    Employee(string n, double b, double bo) {
        name = n;
        basic = b;
        bonus = bo;
    }

    void display() {
        cout << "Employee: " << name
             << "\nBasic Salary: Rs " << basic
             << "\nBonus: Rs " << bonus << endl;
    }

    // Friend function declaration
    friend void calculateTotalSalary(Employee e);
};

// Friend function definition
void calculateTotalSalary(Employee e) {
    double total = e.basic + e.bonus;      // can access private members
    cout << "\n----- Payroll Calculation -----" << endl;
    cout << "Employee Name : " << e.name << endl;
    cout << "Total Salary  : Rs " << total << endl;
}

int main() {
    Employee emp("Kavita Joshi", 40000, 8500);

    emp.display();
    calculateTotalSalary(emp);     // friend function call

    return 0;
}
`,
        logic:
          "Payroll is modelled as an external department's job rather than as something the Employee object does for itself. The friend function takes the employee by value, reads basic and bonus directly — which friendship permits — adds them and prints the result, leaving the object unchanged.",
        concept:
          "Friend functions for operations that conceptually belong outside the class, passing an object to a free function, accessing several private members from one place, read-only use of private data from outside.",
        workflow:
          "1. declare `friend void calculateTotalSalary(Employee)` → 2. define it → 3. build emp → 4. emp.display() shows basic and bonus → 5. calculateTotalSalary(emp) computes and prints the total.",
      },
    ],
  },

  {
    id: "lab-6",
    name: "6 — Constructors & Copy Constructor",
    description:
      "Initializing objects at creation, cloning them with a copy constructor, and proving that copies live independent lives.",
    items: [
      {
        id: "l6q1",
        title: "Student with parameterized and copy constructors",
        question:
          "Define a class Student with a parameterized constructor that sets roll, name and marks, and a copy constructor that clones an existing student. Create an original and a backup and display both.",
        lang: "cpp",
        code: String.raw`#include <iostream>
#include <string>
using namespace std;

class Student {
private:
    int roll;
    string name;
    float marks;

public:
    // a) + b) Parameterized Constructor
    Student(int r, string n, float m) {
        roll = r;
        name = n;
        marks = m;
        cout << "Parameterized constructor called for " << name << endl;
    }

    // c) Copy Constructor
    Student(const Student &s) {          // const reference is the standard way
        roll  = s.roll;
        name  = s.name;
        marks = s.marks;
        cout << "Copy constructor called - cloning " << name << endl;
    }

    void display() {
        cout << "\nRoll No : " << roll
             << "\nName    : " << name
             << "\nMarks   : " << marks << endl;
    }
};

int main() {
    // Creating original student object using parameterized constructor
    Student s1(101, "Aarav Sharma", 87.5);

    cout << "\n----- Original Student -----" << endl;
    s1.display();

    // Creating a duplicate (backup) using copy constructor
    Student s2 = s1;          // or Student s2(s1);

    cout << "\n----- Backup (Cloned) Student -----" << endl;
    s2.display();

    return 0;
}
`,
        logic:
          "The parameterized constructor runs when s1 is built from three literal values. `Student s2 = s1;` then invokes the copy constructor, which copies each member from s1 into s2 — the printed messages prove which constructor ran and in what order. The two objects are separate: editing s2 cannot reach s1.",
        concept:
          "Parameterized constructor initialising at creation instead of via later setters, the copy constructor signature `const ClassName &`, why const (no modification) and why reference (no expensive copy / no infinite recursion), when the copy constructor fires (copy-initialisation, pass by value, return by value).",
        workflow:
          "1. `Student s1(101, name, 87.5)` → parameterized ctor → 2. display s1 → 3. `Student s2 = s1` → copy ctor runs → 4. display s2 → 5. two independent objects.",
      },
      {
        id: "l6q2",
        title: "Bank account, joint account and deposit()",
        question:
          "Define a class Account with a parameterized constructor and a copy constructor that creates a joint account, plus a deposit() member. Copy an account into a joint one, deposit into the joint account only, and prove the original is unchanged.",
        lang: "cpp",
        code: String.raw`#include <iostream>
#include <string>
using namespace std;

class Account {
private:
    string holderName;
    double balance;

public:
    // a) Parameterized Constructor
    Account(string name, double bal) {
        holderName = name;
        balance = bal;
        cout << "New account created for " << holderName
             << " with balance Rs " << balance << endl;
    }

    // b) Copy Constructor (for joint account)
    Account(const Account &acc) {
        holderName = acc.holderName + " (Joint)";
        balance = acc.balance;          // start with same balance
        cout << "Joint account created by copying "
             << acc.holderName << endl;
    }

    // c) deposit() function that modifies the object
    void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
            cout << "Rs " << amount << " deposited. New balance = Rs "
                 << balance << endl;
        } else {
            cout << "Invalid deposit amount!" << endl;
        }
    }

    void display() {
        cout << "Account Holder : " << holderName
             << "\nBalance        : Rs " << balance << endl;
    }
};

int main() {
    // Create primary account
    Account a1("Priya Mehta", 25000.0);

    cout << "\n----- Primary Account -----" << endl;
    a1.display();

    // Create joint account by copying
    Account a2 = a1;          // copy constructor is called

    cout << "\n----- Joint Account (before deposit) -----" << endl;
    a2.display();

    // Deposit money into the joint account only
    cout << "\nDepositing Rs 5000 into joint account...\n";
    a2.deposit(5000);

    cout << "\n----- Joint Account (after deposit) -----" << endl;
    a2.display();

    cout << "\n----- Primary Account (unchanged) -----" << endl;
    a1.display();             // proves the two objects are independent

    return 0;
}
`,
        logic:
          "The copy constructor does more than a byte-for-byte clone: it appends \" (Joint)\" to the holder's name so the two accounts are distinguishable, while starting from the same balance. Because both members are simple types, copying them member-by-member already produces fully independent objects — so depositing into a2 changes a2's balance only, and a1 still reads 25000 at the end.",
        concept:
          "Customising copy semantics rather than accepting the default, member-wise copy giving independence for simple types, side-effect-free copying, deposit() mutating only its own object, shallow vs deep copy (deep not needed here).",
        workflow:
          "1. build a1 → 2. `Account a2 = a1` calls the copy ctor → 3. show both → 4. a2.deposit(5000) → 5. show a2 (30000) → 6. show a1 (still 25000).",
      },
      {
        id: "l6q3",
        title: "Product variant via copy constructor",
        question:
          "Define a class Product with both a parameterized and a copy constructor. Clone a product into a cheaper variant, change only the variant's price with setPrice(), and show that the original is untouched.",
        lang: "cpp",
        code: String.raw`#include <iostream>
#include <string>
using namespace std;

class Product {
private:
    int id;
    string name;
    double price;

public:
    // a) Parameterized Constructor
    Product(int i, string n, double p) {
        id = i;
        name = n;
        price = p;
        cout << "Product created: " << name << endl;
    }

    // a) Copy Constructor
    Product(const Product &p) {
        id = p.id;
        name = p.name;
        price = p.price;
        cout << "Product copied (variant created)" << endl;
    }

    // Function to change price of the current object
    void setPrice(double newPrice) {
        price = newPrice;
    }

    void display() {
        cout << "ID    : " << id
             << "\nName  : " << name
             << "\nPrice : Rs " << price << endl;
    }
};

int main() {
    // Original product
    Product p1(1001, "Wireless Earbuds", 2499.00);

    cout << "\n----- Original Product -----" << endl;
    p1.display();

    // Create a similar variant by copying
    Product p2 = p1;          // copy constructor called

    cout << "\n----- Copied Product (before price change) -----" << endl;
    p2.display();

    // Now change only the price of the copied product
    cout << "\nChanging price of the variant to Rs 1999...\n";
    p2.setPrice(1999.00);

    cout << "\n----- Copied Product (after price change) -----" << endl;
    p2.display();

    cout << "\n----- Original Product (still unchanged) -----" << endl;
    p1.display();

    return 0;
}
`,
        logic:
          "Cloning avoids re-entering the ID and name that the variant shares with the original — only the differing attribute, price, is written afterwards with setPrice(). Since setPrice() mutates just p2's own price member, p1 keeps 2499 while p2 shows 1999, demonstrating that the copy is a fully separate object.",
        concept:
          "Using the copy constructor as a prototype/clone to avoid duplicated setup, an explicit mutator (setPrice) changing one field on one instance, object independence after copying, the simplified form of the Prototype pattern.",
        workflow:
          "1. build p1 → 2. display p1 → 3. `Product p2 = p1` copy ctor → 4. display p2 → 5. p2.setPrice(1999) → 6. display p2 → 7. display p1 unchanged.",
      },
    ],
  },

  {
    id: "lab-7",
    name: "7 — Basic C++ Programs",
    description:
      "Sorting, geometry and digit manipulation — bubble sort, the Pythagorean test, place-value surgery and unit conversion.",
    items: [
      {
        id: "l7q1",
        title: "Sort seven numbers in descending order",
        question:
          "Write a C++ program that reads seven numbers and sorts them into descending order using bubble sort, then prints the sorted array.",
        sampleInput: "7\n12 4 99 7 23 8 1",
        lang: "cpp",
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    int arr[7];
    int i, j, temp;

    // Step 1: Read seven numbers
    cout << "Enter 7 numbers: ";
    for (i = 0; i < 7; i++) {
        cin >> arr[i];
    }

    // Step 2: Bubble Sort in descending order
    for (i = 0; i < 6; i++) {               // outer loop
        for (j = 0; j < 6 - i; j++) {        // inner loop
            if (arr[j] < arr[j + 1]) {       // swap if left is smaller
                temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }

    // Step 3: Display the sorted array
    cout << "\nNumbers in descending order: ";
    for (i = 0; i < 7; i++) {
        cout << arr[i] << " ";
    }
    cout << endl;

    return 0;
}
`,
        logic:
          "Each pass compares neighbouring pairs and swaps them whenever the left one is smaller, so the smallest unplaced value sinks to the end of the pass — hence 'bubble'. The inner bound shrinks by i every pass because the last i positions are already final. Six passes fully sort seven elements.",
        concept:
          "Bubble sort with nested loops, why the inner bound is n-1-i (already-sorted tail), swapping through a temporary, why `<` gives descending order (flipping it gives ascending), O(n²) complexity being fine for n = 7.",
        workflow:
          "1. read 7 values into arr[] → 2. outer loop 6 passes → 3. inner loop compares neighbours, swapping when arr[j] < arr[j+1] → 4. print the sorted array.",
      },
      {
        id: "l7q2",
        title: "Do three lengths form a right triangle?",
        question:
          "Write a C++ program that reads three side lengths and reports whether they form a right-angled triangle. Check the triangle inequality first, then test all three Pythagorean pairings.",
        sampleInput: "3 4 5",
        lang: "cpp",
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    float a, b, c;

    cout << "Enter the three sides of the triangle: ";
    cin >> a >> b >> c;

    // First check if they can form any triangle at all (optional but good practice)
    if (a + b <= c || a + c <= b || b + c <= a) {
        cout << "These sides cannot form a triangle." << endl;
        return 0;
    }

    // Now check the Pythagorean theorem
    // We square the sides and compare
    float a2 = a * a;
    float b2 = b * b;
    float c2 = c * c;

    if (a2 + b2 == c2 || a2 + c2 == b2 || b2 + c2 == a2) {
        cout << "Yes, the sides form a right-angled triangle." << endl;
    } else {
        cout << "No, the sides do not form a right-angled triangle." << endl;
    }

    return 0;
}
`,
        logic:
          "A right triangle satisfies a² + b² = c² where c is the hypotenuse. Because the inputs are not pre-sorted by length, the hypotenuse could be any of the three, so all three pairings are tested with OR. The triangle inequality is checked first so impossible triples are rejected before the Pythagorean test runs.",
        concept:
          "The Pythagorean relation, testing every permutation when the longest side is unknown, the triangle inequality as a precondition, float so fractional sides work, squaring once into named variables for readability.",
        workflow:
          "1. read a, b, c → 2. verify the triangle inequality → 3. square each side → 4. test a²+b²==c2 || a²+c²==b2 || b²+c²==a2 → 5. print the verdict.",
      },
      {
        id: "l7q3",
        title: "Swap the first and last digits of a number",
        question:
          "Write a C++ program that reads a number and exchanges its first and last digits, leaving the digits in between unchanged. Handle single-digit and negative inputs.",
        sampleInput: "48921",
        lang: "cpp",
        code: String.raw`#include <iostream>
#include <cmath>          // for pow() and log10()
using namespace std;

int main() {
    long long num, original;
    cout << "Enter a number: ";
    cin >> num;

    original = num;                     // keep a copy for display

    if (num < 0) num = -num;            // work with absolute value

    // Special case: single-digit number
    if (num < 10) {
        cout << "After swapping: " << original << endl;
        return 0;
    }

    // Find the number of digits
    int digits = (int)log10(num) + 1;

    // Extract last digit
    int last = num % 10;

    // Extract first digit
    int first = num / (long long)pow(10, digits - 1);

    // Remove first and last digits, keep the middle part
    long long middle = num % (long long)pow(10, digits - 1);   // remove first
    middle = middle / 10;                                       // remove last

    // Reconstruct the new number
    long long result = last * (long long)pow(10, digits - 1)   // last becomes first
                     + middle * 10
                     + first;                                  // first becomes last

    if (original < 0) result = -result;   // restore sign if original was negative

    cout << "Original number : " << original << endl;
    cout << "After swapping  : " << result << endl;

    return 0;
}
`,
        logic:
          "The number is treated as a sequence of digits rather than as one value. log10(n)+1 gives the digit count, so 10^(digits-1) is the place value of the leading digit: dividing by it yields the first digit, and taking the modulus with it strips the first digit away. Dividing that remainder by 10 strips the last one, isolating the middle. The new number is reassembled as last×10^(d-1) + middle×10 + first.",
        concept:
          "log10() and pow() from <cmath>, place-value arithmetic for digit isolation, long long to avoid integer overflow in the exponent, handling the single-digit and negative special cases, reconstructing a value from parts.",
        workflow:
          "1. read num → 2. guard single-digit and negatives → 3. digits = log10(num)+1 → 4. last = num % 10, first = num / 10^(d-1) → 5. middle = (num % 10^(d-1)) / 10 → 6. reassemble → 7. restore the sign.",
      },
      {
        id: "l7q4",
        title: "Third angle of a triangle",
        question:
          "Write a C++ program that reads two angles of a triangle and computes the third, rejecting any pair that cannot belong to a triangle.",
        sampleInput: "40 60",
        lang: "cpp",
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    float angle1, angle2, angle3;

    cout << "Enter the first angle: ";
    cin >> angle1;
    cout << "Enter the second angle: ";
    cin >> angle2;

    // Basic validation
    if (angle1 <= 0 || angle2 <= 0 || angle1 + angle2 >= 180) {
        cout << "Invalid angles! They cannot form a triangle." << endl;
        return 0;
    }

    // Sum of angles in any triangle is 180°
    angle3 = 180 - (angle1 + angle2);

    cout << "\nThe third angle is: " << angle3 << " degrees" << endl;

    return 0;
}
`,
        logic:
          "The interior angles of any triangle always sum to 180°, so the unknown angle is simply 180 minus the two given ones. The guard before the subtraction enforces the geometric preconditions — both inputs must be positive and their sum must be strictly below 180, otherwise the answer would be zero or negative.",
        concept:
          "Applying a fixed mathematical constant as the core of an algorithm, precondition validation before computing, float so fractional degrees (45.5°) work, early return on invalid input.",
        workflow:
          "1. read angle1 and angle2 → 2. validate > 0 and sum < 180 → 3. angle3 = 180 - (angle1 + angle2) → 4. print it.",
      },
      {
        id: "l7q5",
        title: "Convert centimetres to metres and kilometres",
        question:
          "Write a C++ program that reads a length in centimetres and converts it to metres and kilometres.",
        sampleInput: "250000",
        lang: "cpp",
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    double cm, meters, kilometers;

    cout << "Enter length in centimeters: ";
    cin >> cm;

    // Conversion factors
    meters     = cm / 100.0;          // 1 m = 100 cm
    kilometers = cm / 100000.0;       // 1 km = 100 000 cm

    cout << "\nLength in meters     : " << meters << " m" << endl;
    cout << "Length in kilometers : " << kilometers << " km" << endl;

    return 0;
}
`,
        logic:
          "Unit conversion is direct arithmetic using the fixed factors 1 m = 100 cm and 1 km = 100 000 cm, so both answers come from dividing the same input by a different constant. Writing the divisors as 100.0 and 100000.0 — with a decimal point — forces floating-point division instead of integer truncation.",
        concept:
          "Conversion factors as divisors, why 100.0 rather than 100 (integer division would truncate), double for better precision on large or small values, deriving km by dividing by 100000 rather than converting twice.",
        workflow:
          "1. read cm → 2. meters = cm / 100.0 → 3. kilometers = cm / 100000.0 → 4. print both with units.",
      },
    ],
  },

  {
    id: "lab-8",
    name: "8 — Inheritance in C++",
    description:
      "Single, multilevel, hierarchical, multiple and hybrid inheritance — closing with virtual base classes and the diamond problem.",
    items: [
      {
        id: "l8q1",
        title: "Single inheritance — Employee → Salary",
        question:
          "Create a base class Employee holding ID and name with getEmployeeData()/displayEmployee(), and a derived class Salary that adds basic, HRA and DA, computes gross salary and displays the complete record.",
        sampleInput: "101\nAarav Sharma\n50000\n10000\n8000",
        lang: "cpp",
        code: String.raw`#include <iostream>
#include <string>
using namespace std;

// a) Base class Employee
class Employee {
protected:                  // protected so derived class can access
    int id;
    string name;
public:
    void getEmployeeData() {
        cout << "Enter Employee ID: ";
        cin >> id;
        cin.ignore();       // clear newline left by cin
        cout << "Enter Employee Name: ";
        getline(cin, name);
    }
    void displayEmployee() {
        cout << "\nEmployee ID   : " << id << endl;
        cout << "Employee Name : " << name << endl;
    }
};

// b) Derived class Salary
class Salary : public Employee {
private:
    float basic, HRA, DA;
public:
    void getSalaryData() {
        getEmployeeData();          // reuse base class function
        cout << "Enter Basic Salary: ";
        cin >> basic;
        cout << "Enter HRA: ";
        cin >> HRA;
        cout << "Enter DA: ";
        cin >> DA;
    }

    // c) Function to calculate gross salary
    float calculateGross() {
        return basic + HRA + DA;
    }

    // d) Display complete information
    void displaySalary() {
        displayEmployee();
        cout << "Basic Salary  : " << basic << endl;
        cout << "HRA           : " << HRA << endl;
        cout << "DA            : " << DA << endl;
        cout << "Gross Salary  : " << calculateGross() << endl;
    }
};

int main() {
    Salary s;
    s.getSalaryData();
    s.displaySalary();
    return 0;
}
`,
        logic:
          "Employee owns the identity fields and the two functions that read and print them; Salary inherits them and adds only the pay components. getSalaryData() calls the inherited getEmployeeData() first so the shared data is collected once, then reads its own three fields — and displaySalary() reuses displayEmployee() the same way. Gross salary is computed on demand by calculateGross().",
        concept:
          "Single inheritance (one derived class from one base), `protected` so the derived class can use members that stay hidden from outside, `class Salary : public Employee`, code reuse eliminating duplicated read/display logic, calling inherited members directly.",
        workflow:
          "1. declare `class Salary : public Employee` → 2. getSalaryData() calls getEmployeeData() then reads basic/HRA/DA → 3. calculateGross() returns basic+HRA+DA → 4. displaySalary() reuses displayEmployee() and prints the rest.",
      },
      {
        id: "l8q2",
        title: "Multilevel inheritance — Student → Marks → Result",
        question:
          "Build a three-level chain: Student (roll, name) → Marks (three subject marks) → Result (total, percentage, grade). Read a student's marks and display the calculated result with the grade.",
        sampleInput: "101\nAarav Sharma\n85 90 75",
        lang: "cpp",
        code: String.raw`#include <iostream>
#include <string>
using namespace std;

// a) Base class Student
class Student {
protected:
    int roll;
    string name;
public:
    void getStudent() {
        cout << "Enter Roll Number: ";
        cin >> roll;
        cin.ignore();
        cout << "Enter Name: ";
        getline(cin, name);
    }
    void displayStudent() {
        cout << "\nRoll No : " << roll << endl;
        cout << "Name    : " << name << endl;
    }
};

// b) Intermediate class Marks
class Marks : public Student {
protected:
    float m1, m2, m3;
public:
    void getMarks() {
        getStudent();
        cout << "Enter marks of 3 subjects: ";
        cin >> m1 >> m2 >> m3;
    }
    void displayMarks() {
        displayStudent();
        cout << "Marks   : " << m1 << ", " << m2 << ", " << m3 << endl;
    }
};

// c) Derived class Result
class Result : public Marks {
private:
    float total, percentage;
    char grade;
public:
    // d) Calculate total and percentage
    void calculate() {
        total = m1 + m2 + m3;
        percentage = total / 3.0;
    }

    // e) Assign grade according to rules
    void assignGrade() {
        if (percentage >= 80)      grade = 'A';
        else if (percentage >= 60) grade = 'B';
        else if (percentage >= 40) grade = 'C';
        else                       grade = 'F';   // Fail
    }

    void displayResult() {
        displayMarks();
        calculate();
        assignGrade();
        cout << "Total     : " << total << endl;
        cout << "Percentage: " << percentage << "%" << endl;
        cout << "Grade     : " << grade << endl;
    }
};

int main() {
    Result r;
    r.getMarks();
    r.displayResult();
    return 0;
}
`,
        logic:
          "Each level adds one concern: Student carries identity, Marks adds scores and itself calls getStudent(), Result adds the computed verdict and calls displayMarks(). Because Result inherits through Marks, it can read m1/m2/m3 directly in calculate(). Grade is assigned by a descending ladder of thresholds, so the first matching bound wins.",
        concept:
          "Multilevel inheritance (A → B → C), progressive specialisation where each level builds on the last, protected data flowing down the chain without getters, method chaining up the hierarchy (Result calls Marks calls Student), threshold ladders for grading.",
        workflow:
          "1. `class Marks : public Student`, `class Result : public Marks` → 2. r.getMarks() → getStudent() then the three marks → 3. displayResult() → displayMarks() → 4. calculate() totals and averages → 5. assignGrade() picks A/B/C/F → 6. print.",
      },
      {
        id: "l8q3",
        title: "Hierarchical inheritance — Savings vs Current account",
        question:
          "Create a base Account (number, name, balance) and derive two classes: SavingsAccount that adds 5% interest and CurrentAccount that deducts a ₹100 transaction charge. Read both accounts and display each with its own rule applied.",
        sampleInput: "1001\nPriya Mehta\n50000\n2001\nRahul Sharma\n30000",
        lang: "cpp",
        code: String.raw`#include <iostream>
#include <string>
using namespace std;

// a) Base class Account
class Account {
protected:
    int accNo;
    string name;
    float balance;
public:
    void getAccount() {
        cout << "Enter Account Number: ";
        cin >> accNo;
        cin.ignore();
        cout << "Enter Customer Name: ";
        getline(cin, name);
        cout << "Enter Balance: ";
        cin >> balance;
    }
    void displayAccount() {
        cout << "\nAccount No : " << accNo << endl;
        cout << "Name       : " << name << endl;
        cout << "Balance    : " << balance << endl;
    }
};

// b) Derived class SavingsAccount
class SavingsAccount : public Account {
public:
    // c) Interest at 5%
    void calculateInterest() {
        float interest = balance * 0.05;
        balance += interest;
        cout << "Interest added (5%): " << interest << endl;
        cout << "New Balance: " << balance << endl;
    }
    void display() {
        cout << "\n----- Savings Account -----" << endl;
        displayAccount();
        calculateInterest();
    }
};

// b) Derived class CurrentAccount
class CurrentAccount : public Account {
public:
    // d) Transaction charge of Rs 100
    void deductCharge() {
        balance -= 100;
        cout << "Transaction charge of Rs 100 deducted." << endl;
        cout << "New Balance: " << balance << endl;
    }
    void display() {
        cout << "\n----- Current Account -----" << endl;
        displayAccount();
        deductCharge();
    }
};

int main() {
    SavingsAccount s;
    CurrentAccount c;

    cout << "Enter Savings Account details:\n";
    s.getAccount();
    s.display();

    cout << "\nEnter Current Account details:\n";
    c.getAccount();
    c.display();

    return 0;
}
`,
        logic:
          "accNo, name and balance are declared once in Account, so neither derived class repeats them — both inherit them and reuse displayAccount(). Each subclass then implements only its own business rule: 5% interest added to the balance for savings, a flat ₹100 deduction for current. One base, two specialisations, no duplication.",
        concept:
          "Hierarchical inheritance (one base, several derived classes), the is-a relationship (a SavingsAccount is an Account), inheriting shared data instead of duplicating it, per-subclass specialisation of behaviour, each derived class extending the base's balance.",
        workflow:
          "1. declare Account with protected fields → 2. derive SavingsAccount and CurrentAccount from it → 3. read savings, display, apply interest → 4. read current, display, deduct the charge.",
      },
      {
        id: "l8q4",
        title: "Multiple inheritance — Communication + Media → SmartPhone",
        question:
          "Create two base classes, Communication (makeCall) and Media (playMusic), and a SmartPhone derived from both that also stores a model. Demonstrate calling the inherited behaviour from one object.",
        lang: "cpp",
        code: String.raw`#include <iostream>
#include <string>
using namespace std;

// a) First base class
class Communication {
public:
    void makeCall() {
        cout << "Making a phone call..." << endl;
    }
};

// b) Second base class
class Media {
public:
    void playMusic() {
        cout << "Playing music..." << endl;
    }
};

// c) Derived class using multiple inheritance
class SmartPhone : public Communication, public Media {
private:
    string model;
public:
    void setModel(string m) {
        model = m;
    }
    // d) Display model
    void displayModel() {
        cout << "Smartphone Model: " << model << endl;
    }
};

int main() {
    // e) Demonstrate multiple inheritance
    SmartPhone phone;
    phone.setModel("Galaxy S25 Ultra");
    phone.displayModel();
    phone.makeCall();      // inherited from Communication
    phone.playMusic();     // inherited from Media
    return 0;
}
`,
        logic:
          "SmartPhone lists both bases after the colon, so it inherits the public interface of each. One object therefore answers to makeCall() from Communication and playMusic() from Media while adding its own private model field. Because neither base declares a member with the same name, there is no ambiguity to resolve.",
        concept:
          "Multiple inheritance syntax `class D : public B1, public B2`, combining independent capabilities in one object, inheriting two public interfaces, why name clashes would be ambiguous (none here), modelling a device with several unrelated traits.",
        workflow:
          "1. declare Communication with makeCall() → 2. declare Media with playMusic() → 3. `class SmartPhone : public Communication, public Media` → 4. build a phone, set its model → 5. call both inherited functions.",
      },
      {
        id: "l8q5",
        title: "Hybrid inheritance and the diamond problem",
        question:
          "Create a grand-parent Person, two intermediate classes Student and Employee both derived from it, and a final class TeachingAssistant derived from both. Use virtual inheritance so only one copy of Person exists and displayName() is unambiguous.",
        lang: "cpp",
        code: String.raw`#include <iostream>
#include <string>
using namespace std;

// a) Grand-base class
class Person {
protected:
    string name;
public:
    void setName(string n) { name = n; }
    void displayName() { cout << "Name: " << name << endl; }
};

// b) Intermediate classes – notice the keyword virtual
class Student : virtual public Person {
public:
    void studentInfo() {
        cout << "I am a Student." << endl;
    }
};

class Employee : virtual public Person {
public:
    void employeeInfo() {
        cout << "I am an Employee." << endl;
    }
};

// c) Final derived class
class TeachingAssistant : public Student, public Employee {
public:
    void display() {
        displayName();          // now unambiguous
        studentInfo();
        employeeInfo();
        cout << "I am a Teaching Assistant (both student and employee)." << endl;
    }
};

int main() {
    TeachingAssistant ta;
    ta.setName("Aarav Sharma");
    ta.display();
    return 0;
}
`,
        logic:
          "Without virtual, TeachingAssistant would inherit Person twice — once through Student and once through Employee — so a call to displayName() would match two different sub-objects and fail to compile. Marking both intermediate classes `virtual public Person` makes the compiler place a single shared Person sub-object in the final object, so there is exactly one `name` and one displayName() to resolve.",
        concept:
          "Hybrid inheritance (multiple + multilevel combined), the diamond problem and its ambiguity, `virtual public` base classes collapsing duplicated bases into one shared sub-object, why the final class must still list both direct bases.",
        workflow:
          "1. declare Person → 2. `class Student : virtual public Person` → 3. `class Employee : virtual public Person` → 4. `class TeachingAssistant : public Student, public Employee` → 5. ta.setName() writes to the single shared Person → 6. display() calls one unambiguous displayName().",
      },
    ],
  },
];
