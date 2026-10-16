/**
 * Lab Assignments 3 and 4 — C++ programs.
 * Edit this file to add / remove codes from these two sessions.
 *
 * Each item: id, title, question, sampleInput, code, logic, concept, workflow, lang.
 * `lang` drives the compiler: "c" uses gcc, "cpp" uses g++.
 */
export const labs34 = [
  {
    id: "lab-3",
    name: "3 — Basic C++ Programs",
    description:
      "First contact with C++ — cin/cout, arithmetic and logical operators, if-else and compound conditions.",
    items: [
      {
        id: "l3q1",
        title: "Add two numbers",
        question:
          "Write a C++ program that reads two integers from the user and displays their sum.",
        sampleInput: "5\n7",
        lang: "cpp",
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    int a, b, sum;

    cout << "Enter first number: ";
    cin >> a;
    cout << "Enter second number: ";
    cin >> b;

    sum = a + b;

    cout << "Sum = " << sum << endl;
    return 0;
}
`,
        logic:
          "Two integers are declared, read one after the other with cin, added into sum, and streamed back out with cout. Nothing else is needed — this is the smallest complete C++ program after Hello World.",
        concept:
          "iostream and the cout / cin stream objects, the << and >> insertion/extraction operators, endl for a newline with flush, using namespace std.",
        workflow:
          "1. Include iostream → 2. declare a, b, sum → 3. prompt and read a → 4. prompt and read b → 5. sum = a + b → 6. print the result.",
      },
      {
        id: "l3q2",
        title: "Odd or even",
        question:
          "Write a C++ program that reads an integer and reports whether it is odd or even.",
        sampleInput: "7",
        lang: "cpp",
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    int n;

    cout << "Enter a number: ";
    cin >> n;

    if (n % 2 == 0)
        cout << n << " is Even." << endl;
    else
        cout << n << " is Odd." << endl;

    return 0;
}
`,
        logic:
          "Dividing any integer by 2 leaves a remainder of either 0 or 1. The % operator returns that remainder, so n % 2 == 0 is true exactly for even numbers, and the if-else prints the matching verdict.",
        concept:
          "The modulus operator % as a parity test, if-else as a two-way branch, streaming output with cout <<.",
        workflow:
          "1. Read n → 2. evaluate n % 2 == 0 → 3. print Even in the true branch, Odd in the else branch.",
      },
      {
        id: "l3q3",
        title: "Swap two numbers without a third variable",
        question:
          "Write a C++ program that reads two integers and swaps them using arithmetic, without introducing any temporary variable.",
        sampleInput: "10\n20",
        lang: "cpp",
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    int a, b;

    cout << "Enter first number (a): ";
    cin >> a;
    cout << "Enter second number (b): ";
    cin >> b;

    cout << "\nBefore swapping: a = " << a << ", b = " << b << endl;

    // Swapping without third variable
    a = a + b;   // a now holds sum
    b = a - b;   // b becomes original a
    a = a - b;   // a becomes original b

    cout << "\nAfter swapping : a = " << a << ", b = " << b << endl;
    return 0;
}
`,
        logic:
          "After a = a + b, a holds the sum. Subtracting the current b from that sum leaves the original a, so b = a - b stores the original a in b. Finally a - b (sum minus original a) leaves the original b, which goes back into a. Two subtractions recover both originals from the single sum.",
        concept:
          "In-place swapping through arithmetic, sequencing where each assignment depends on the previous one, why the classic temp variable is normally used, an alternative XOR swap (a ^= b ^= a ^= b).",
        workflow:
          "1. Read a and b → 2. print both → 3. a = a + b → 4. b = a - b → 5. a = a - b → 6. print both again.",
      },
      {
        id: "l3q4",
        title: "Largest of three numbers",
        question:
          "Write a C++ program that reads three integers and prints the largest of them.",
        sampleInput: "12 45 7",
        lang: "cpp",
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    int a, b, c;

    cout << "Enter three numbers: ";
    cin >> a >> b >> c;

    if (a >= b && a >= c)
        cout << a << " is the largest." << endl;
    else if (b >= a && b >= c)
        cout << b << " is the largest." << endl;
    else
        cout << c << " is the largest." << endl;

    return 0;
}
`,
        logic:
          "A candidate is the largest only if it is not smaller than either of the other two, so each test is a conjunction with &&. The first candidate that satisfies its test wins; if neither a nor b qualifies, c must be the largest, so the final branch needs no condition.",
        concept:
          "Compound conditions with logical AND &&, else-if ladders for mutually exclusive cases, why the final branch can omit its test, >= rather than > so ties still resolve.",
        workflow:
          "1. Read a, b, c → 2. if a >= b && a >= c print a → 3. else if b >= a && b >= c print b → 4. else print c.",
      },
      {
        id: "l3q5",
        title: "Triple the difference from 51 when greater",
        question:
          "Write a C++ program that reads a number n. If n is greater than 51, print three times the difference (n - 51); otherwise print the plain absolute difference from 51.",
        sampleInput: "60",
        lang: "cpp",
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    int n, diff;

    cout << "Enter a number (n): ";
    cin >> n;

    if (n > 51) {
        diff = (n - 51) * 3;      // triple the difference
    } else {
        diff = 51 - n;            // absolute difference
    }

    cout << "Result = " << diff << endl;
    return 0;
}
`,
        logic:
          "The two branches guarantee a positive result without needing abs(): in the first branch n > 51 makes n - 51 positive, and in the second 51 - n is positive because n ≤ 51. The comparison picks which of the two formulas applies, then a single variable holds the answer.",
        concept:
          "Conditional arithmetic — the branch decides the formula, forming an absolute value by ordering the operands, single-alternative if with braces, why abs() is unnecessary here.",
        workflow:
          "1. Read n → 2. if n > 51 compute (n - 51) * 3 → 3. else compute 51 - n → 4. print diff.",
      },
      {
        id: "l3q6",
        title: "Is either number 30, or is their sum 30?",
        question:
          "Write a C++ program that reads two integers and prints True if either number equals 30 or their sum equals 30, otherwise False.",
        sampleInput: "30\n5",
        lang: "cpp",
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    int a, b;

    cout << "Enter two integers: ";
    cin >> a >> b;

    if (a == 30 || b == 30 || (a + b) == 30)
        cout << "True" << endl;
    else
        cout << "False" << endl;

    return 0;
}
`,
        logic:
          "Three independent conditions are joined with ||. Because logical OR is satisfied by any single true operand, the whole test passes as soon as one of them holds — the first number being 30, the second being 30, or the pair summing to 30.",
        concept:
          "The logical OR operator ||, chaining several alternatives in one condition, short-circuit evaluation (later operands are skipped once one is true), == for comparison.",
        workflow:
          "1. Read a and b → 2. test a == 30 || b == 30 || a + b == 30 → 3. print True or False.",
      },
      {
        id: "l3q7",
        title: "Same last digit?",
        question:
          "Write a C++ program that reads two non-negative integers and reports whether they share the same last digit.",
        sampleInput: "24\n64",
        lang: "cpp",
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    int a, b;

    cout << "Enter two non-negative integers: ";
    cin >> a >> b;

    // Last digit is obtained by % 10
    if (a % 10 == b % 10)
        cout << "True - both have the same last digit." << endl;
    else
        cout << "False - last digits are different." << endl;

    return 0;
}
`,
        logic:
          "Modulo 10 isolates the units digit of a number (24 % 10 is 4, 64 % 10 is also 4). Applying the same extraction to both operands makes the comparison depend only on that digit, ignoring every higher place value.",
        concept:
          "Digit extraction with % 10 — the single most reused technique in number problems, comparing derived values rather than originals, non-negative input so the remainder is well defined.",
        workflow:
          "1. Read a and b → 2. compute a % 10 and b % 10 → 3. compare → 4. print True or False.",
      },
      {
        id: "l3q8",
        title: "Can two of them add up to the third?",
        question:
          "Write a C++ program that reads three integers and reports whether any two of them add up to the third.",
        sampleInput: "3\n4\n7",
        lang: "cpp",
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    int x, y, z;

    cout << "Enter three integers: ";
    cin >> x >> y >> z;

    // Check all three possible combinations
    if ((x + y == z) || (x + z == y) || (y + z == x))
        cout << "True - it is possible." << endl;
    else
        cout << "False - it is not possible." << endl;

    return 0;
}
`,
        logic:
          "With three inputs there are exactly three unordered pairs, and each pair must be tested against the remaining value: x+y vs z, x+z vs y, y+z vs x. Enumerating all of them systematically is what makes the check complete — testing only one pair could miss a valid combination.",
        concept:
          "Enumerating all candidate cases with logical OR, exhaustive checking of pairs, parentheses for clarity in compound conditions.",
        workflow:
          "1. Read x, y, z → 2. test all three pairings → 3. if any holds print True → 4. otherwise print False.",
      },
    ],
  },

  {
    id: "lab-4",
    name: "4 — Basic Programs & Introduction to Classes",
    description:
      "Classic number problems — factorial, digits, prime, perfect, strong — then the first steps into classes and objects.",
    items: [
      {
        id: "l4q1",
        title: "Factorial of a number",
        question:
          "Write a C++ program that reads a positive integer and computes its factorial with a loop. Reject negative input.",
        sampleInput: "5",
        lang: "cpp",
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    int n;
    long long fact = 1;          // long long to handle larger factorials

    cout << "Enter a positive integer: ";
    cin >> n;

    if (n < 0) {
        cout << "Factorial is not defined for negative numbers." << endl;
        return 0;
    }

    for (int i = 1; i <= n; i++) {
        fact = fact * i;
    }

    cout << "Factorial of " << n << " = " << fact << endl;
    return 0;
}
`,
        logic:
          "n! is 1 × 2 × … × n, so a running product starts at 1 (the multiplicative identity) and multiplies in each integer from 1 to n. Each iteration folds one more factor into fact, so after the last pass fact holds the full product.",
        concept:
          "The iterative accumulation pattern (product initialised to 1, sum to 0), for-loop bounds 1..n inclusive, long long because 20! already overflows int, input validation before computing.",
        workflow:
          "1. Read n → 2. if n < 0 report and exit → 3. loop i = 1..n multiplying fact by i → 4. print fact.",
      },
      {
        id: "l4q2",
        title: "Sum of digits",
        question:
          "Write a C++ program that reads a number and prints the sum of its digits, handling negative input correctly.",
        sampleInput: "1234",
        lang: "cpp",
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    int num, sum = 0, digit;

    cout << "Enter a number: ";
    cin >> num;

    int original = num;          // keep original for display

    if (num < 0) num = -num;     // handle negative numbers

    while (num > 0) {
        digit = num % 10;        // extract last digit
        sum = sum + digit;
        num = num / 10;          // remove last digit
    }

    cout << "Sum of digits of " << original << " = " << sum << endl;
    return 0;
}
`,
        logic:
          "Each pass peels off the rightmost digit with % 10 and adds it to the running total; integer division by 10 then drops that digit. Repeating until the number reaches 0 has visited every digit exactly once. The original value is preserved for the message and the sign is stripped first.",
        concept:
          "Digit extraction with % 10 and / 10, the accumulate-and-reduce pattern in a while loop, working on a copy so the original can still be printed, absolute value before processing.",
        workflow:
          "1. Read num → 2. save original, take abs → 3. while num > 0: add num%10 to sum, num /= 10 → 4. print the sum.",
      },
      {
        id: "l4q3",
        title: "Prime number check",
        question:
          "Write a C++ program that reads a positive integer and decides whether it is prime, testing divisibility only up to the square root.",
        sampleInput: "29",
        lang: "cpp",
        code: String.raw`#include <iostream>
#include <cmath>
using namespace std;

int main() {
    int n, i;
    bool isPrime = true;

    cout << "Enter a positive integer: ";
    cin >> n;

    if (n <= 1) {
        isPrime = false;
    } else {
        // Check divisibility only up to sqrt(n)
        for (i = 2; i <= sqrt(n); i++) {
            if (n % i == 0) {
                isPrime = false;
                break;
            }
        }
    }

    if (isPrime)
        cout << n << " is a Prime number." << endl;
    else
        cout << n << " is NOT a Prime number." << endl;

    return 0;
}
`,
        logic:
          "A prime has exactly two divisors, so 0 and 1 are excluded immediately. For larger n, any factor above √n would have a matching partner below √n that we would already have tested — so the loop stops there. Finding any divisor sets the flag false and break exits at once.",
        concept:
          "The bool flag as a running verdict, sqrt() from <cmath> as the optimised loop bound, early break to avoid unnecessary work, explicit handling of the n ≤ 1 edge case.",
        workflow:
          "1. Read n → 2. if n ≤ 1 set isPrime false → 3. else loop i = 2..√n → 4. on any divisor set false and break → 5. print from the flag.",
      },
      {
        id: "l4q4",
        title: "Perfect number check",
        question:
          "Write a C++ program that reads a number and reports whether it is a Perfect number — equal to the sum of its proper divisors (6 = 1+2+3, 28 = 1+2+4+7+14).",
        sampleInput: "28",
        lang: "cpp",
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    int n, sum = 0;

    cout << "Enter a number: ";
    cin >> n;

    for (int i = 1; i <= n / 2; i++) {   // proper divisors only
        if (n % i == 0)
            sum = sum + i;
    }

    if (sum == n && n != 0)
        cout << n << " is a Perfect number." << endl;
    else
        cout << n << " is NOT a Perfect number." << endl;

    return 0;
}
`,
        logic:
          "A proper divisor is a divisor other than the number itself, and no proper divisor can exceed n/2 — so the loop only needs the lower half. Every value that divides n is added to sum; if the total equals n (and n is not 0) the number is perfect.",
        concept:
          "Defining the search range from the mathematical property (divisors ≤ n/2), excluding the number itself from its own divisor list, the sum-and-compare test, guarding against the 0 edge case.",
        workflow:
          "1. Read n → 2. loop i = 1..n/2 → 3. if n % i == 0 add i to sum → 4. compare sum with n → 5. print verdict.",
      },
      {
        id: "l4q5",
        title: "Perfect numbers in a range",
        question:
          "Write a C++ program that prints every Perfect number within a user-supplied range.",
        sampleInput: "1 10000",
        lang: "cpp",
        code: String.raw`#include <iostream>
using namespace std;

int main() {
    int start, end;

    cout << "Enter the range (start and end): ";
    cin >> start >> end;

    cout << "Perfect numbers between " << start << " and " << end << " are:\n";

    for (int num = start; num <= end; num++) {
        int sum = 0;
        for (int i = 1; i <= num / 2; i++) {
            if (num % i == 0)
                sum += i;
        }
        if (sum == num && num > 0)
            cout << num << " ";
    }
    cout << endl;
    return 0;
}
`,
        logic:
          "The perfect-number test from the previous program is embedded as the body of an outer loop that walks the range. For each candidate, sum is reset to zero, its divisors are collected, and only if the total matches the candidate is it printed — so each number is judged independently.",
        concept:
          "Nesting an existing test inside a range loop (code reuse), resetting per-candidate state inside the outer loop, sum += as compound assignment, nested for loops.",
        workflow:
          "1. Read start and end → 2. for each num in range → 3. reset sum, loop divisors ≤ num/2 → 4. if sum == num print num → 5. newline.",
      },
      {
        id: "l4q6",
        title: "Strong number check",
        question:
          "Write a C++ program that reads a number and reports whether it is a Strong number — one equal to the sum of the factorials of its digits (145 = 1! + 4! + 5!).",
        sampleInput: "145",
        lang: "cpp",
        code: String.raw`#include <iostream>
using namespace std;

// Helper function to calculate factorial
int factorial(int n) {
    int f = 1;
    for (int i = 1; i <= n; i++)
        f *= i;
    return f;
}

int main() {
    int num, original, digit, sum = 0;

    cout << "Enter a number: ";
    cin >> num;

    original = num;

    while (num > 0) {
        digit = num % 10;
        sum = sum + factorial(digit);
        num = num / 10;
    }

    if (sum == original)
        cout << original << " is a Strong number." << endl;
    else
        cout << original << " is NOT a Strong number." << endl;

    return 0;
}
`,
        logic:
          "Two earlier techniques are combined: digit extraction walks the number left to right taking % 10 each time, and each digit is passed to factorial(). The factorials accumulate into sum, which is finally compared against the untouched original value.",
        concept:
          "Composing smaller building blocks into a new solution, a helper function that returns a value rather than printing, reusing digit extraction alongside a second routine, why the original must be preserved.",
        workflow:
          "1. Read num → 2. save original → 3. while num > 0: digit = num % 10, sum += factorial(digit), num /= 10 → 4. compare sum with original → 5. print verdict.",
      },
      {
        id: "l4q7",
        title: "Class Book — volume",
        question:
          "Define a class Book with private length, width and height, a getData() member to read them and a calculateVolume() member. Read one book and print its volume.",
        sampleInput: "10 5 2",
        lang: "cpp",
        code: String.raw`#include <iostream>
using namespace std;

class Book {
private:
    float length, width, height;

public:
    void getData() {
        cout << "Enter length, width and height of the book: ";
        cin >> length >> width >> height;
    }

    float calculateVolume() {
        return length * width * height;
    }

    void display() {
        cout << "Volume of the book = " << calculateVolume() << endl;
    }
};

int main() {
    Book b;
    b.getData();
    b.display();
    return 0;
}
`,
        logic:
          "The three dimensions are private, so only the class's own members can touch them. getData() fills them from stdin, calculateVolume() multiplies them and returns the result, and display() simply calls calculateVolume() again to print it — data and the operations on that data live together.",
        concept:
          "The basic class structure: private data members with public member functions, encapsulation (outside code cannot reach length/width/height directly), member functions returning a computed value, calling members with the dot operator.",
        workflow:
          "1. Declare Book b → 2. call b.getData() to read the three floats → 3. b.display() → 4. calculateVolume() returns length*width*height → 5. print it.",
      },
      {
        id: "l4q8",
        title: "Class Car — two objects",
        question:
          "Define a class Car with private id and price and members getData()/display(). Create two Car objects, read both, and print them as a table.",
        sampleInput: "1\n250000\n2\n900000",
        lang: "cpp",
        code: String.raw`#include <iostream>
using namespace std;

class Car {
private:
    int id;
    float price;

public:
    void getData() {
        cout << "Enter Car ID and Price: ";
        cin >> id >> price;
    }

    void display() {
        cout << "Car ID: " << id << ", Price: Rs " << price << endl;
    }
};

int main() {
    Car c1, c2;               // two objects of the same class

    cout << "Enter details of first car:\n";
    c1.getData();

    cout << "Enter details of second car:\n";
    c2.getData();

    cout << "\n----- Car Details -----\n";
    c1.display();
    c2.display();

    return 0;
}
`,
        logic:
          "A class is only a blueprint — c1 and c2 are two separate instances, each with its own id and price occupying their own memory. Writing to c1 leaves c2 untouched, which is why the same getData() call fills different data for each object.",
        concept:
          "Class vs object (blueprint vs instance), multiple objects of one class holding independent copies of the data, the dot operator selecting which object a member acts on.",
        workflow:
          "1. Declare Car c1, c2 → 2. c1.getData() → 3. c2.getData() → 4. print the header → 5. c1.display() → 6. c2.display().",
      },
      {
        id: "l4q9",
        title: "Class Employee with an array of objects",
        question:
          "Define a class Employee with private salary and allowance and a total() member. Create an array of 3 Employee objects, read each one and display the total pay for every employee.",
        sampleInput: "45000 5000\n52000 6500\n48000 4000",
        lang: "cpp",
        code: String.raw`#include <iostream>
using namespace std;

class Employee {
private:
    float salary, allowance;

public:
    void getData() {
        cout << "Enter salary and allowance: ";
        cin >> salary >> allowance;
    }

    void display() {
        cout << "Salary: Rs " << salary
             << ", Allowance: Rs " << allowance
             << ", Total: Rs " << (salary + allowance) << endl;
    }
};

int main() {
    Employee emp[3];          // array of 3 Employee objects

    for (int i = 0; i < 3; i++) {
        cout << "\nEnter details of Employee " << (i + 1) << ":\n";
        emp[i].getData();
    }

    cout << "\n----- Employee Details -----\n";
    for (int i = 0; i < 3; i++) {
        cout << "Employee " << (i + 1) << ": ";
        emp[i].display();
    }

    return 0;
}
`,
        logic:
          "emp[3] is an array of three complete Employee instances, so emp[i] behaves exactly like a normal object — indexing selects which of the three the member function runs on. A loop fills all three, and a second loop displays them, keeping the input and output symmetric.",
        concept:
          "Array of objects as a collection of same-shaped instances, indexing combined with the dot operator (emp[i].getData()), looping over a container instead of repeating calls by hand.",
        workflow:
          "1. Declare Employee emp[3] → 2. loop i = 0..2 reading each employee → 3. print a header → 4. loop again calling emp[i].display() → 5. total is salary + allowance.",
      },
      {
        id: "l4q10",
        title: "Class Student — total of 5 subjects",
        question:
          "Define a class Student with a private array of 5 marks, a calculateTotal() member that sums them and a display() member that reports the roll number and total.",
        sampleInput: "101\n90 85 78 92 88",
        lang: "cpp",
        code: String.raw`#include <iostream>
using namespace std;

class Student {
private:
    int roll;
    float marks[5];
    float total;

public:
    void getData() {
        cout << "Enter Roll Number: ";
        cin >> roll;
        cout << "Enter marks of 5 subjects: ";
        for (int i = 0; i < 5; i++)
            cin >> marks[i];
    }

    void calculateTotal() {
        total = 0;
        for (int i = 0; i < 5; i++)
            total += marks[i];
    }

    void display() {
        calculateTotal();
        cout << "\nRoll No: " << roll
             << "\nTotal Marks: " << total << endl;
    }
};

int main() {
    Student s;
    s.getData();
    s.display();
    return 0;
}
`,
        logic:
          "marks[5] is an array member, so one object carries a whole set of five scores. getData() fills the roll number and then the array with a loop, calculateTotal() walks the array accumulating into total, and display() invokes calculateTotal() first so the total is always current before it is printed.",
        concept:
          "An array as a data member, member functions that call other member functions, accumulating with total += inside a loop, keeping derived state fresh by recomputing on demand.",
        workflow:
          "1. Declare Student s → 2. s.getData() reads roll and 5 marks → 3. s.display() → 4. display() calls calculateTotal() → 5. loop sums the marks → 6. print roll and total.",
      },
    ],
  },
];
