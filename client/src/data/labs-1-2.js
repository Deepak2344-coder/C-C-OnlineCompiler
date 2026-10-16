/**
 * Lab Assignments 1 and 2 — C programs.
 * Edit this file to add / remove codes from these two sessions.
 *
 * Each item: id, title, question, sampleInput, code, logic, concept, workflow, lang.
 * `lang` drives the compiler: "c" uses gcc, "cpp" uses g++.
 */
export const labs12 = [
  {
    id: "lab-1",
    name: "1 — C Programs using Functions & Arrays",
    description:
      "Functions returning flags, code reuse over ranges, digit manipulation and a menu-driven program.",
    items: [
      {
        id: "l1q1",
        title: "Prime check with a function",
        question:
          "Write a C program with a function isPrime(n) that returns 1 if n is prime and 0 otherwise. Read a number from the user and report the verdict.",
        sampleInput: "29",
        lang: "c",
        code: String.raw`#include <stdio.h>
#include <math.h>

int isPrime(int n) {
    if (n <= 1) return 0;               // 0 and 1 are not prime
    for (int i = 2; i <= sqrt(n); i++) {
        if (n % i == 0)
            return 0;                   // not prime
    }
    return 1;                           // prime
}

int main() {
    int num;
    printf("Enter a number: ");
    scanf("%d", &num);

    if (isPrime(num))
        printf("%d is a Prime number.\n", num);
    else
        printf("%d is NOT a Prime number.\n", num);

    return 0;
}
`,
        logic:
          "isPrime() returns 0 immediately for anything ≤ 1. Otherwise it tests divisibility from 2 while i ≤ √n — if a larger factor existed, its pair below √n would already have been found. Any divisor returns 0 early; finishing the loop means no divisor exists, so it returns 1.",
        concept:
          "Functions returning int as a boolean (1/0), early return for short-circuiting, #include <math.h>, sqrt() as the loop limit, the % operator as a divisibility test.",
        workflow:
          "1. Read num → 2. call isPrime(num) → 3. loop i = 2..√n → 4. if n % i == 0 return 0 → 5. otherwise return 1 → 6. print the verdict from the flag.",
      },
      {
        id: "l1q2",
        title: "Primes in a range",
        question:
          "Write a C program that reuses the same isPrime() function to print every prime number in a given range (start to end).",
        sampleInput: "10 50",
        lang: "c",
        code: String.raw`#include <stdio.h>
#include <math.h>

int isPrime(int n) {
    if (n <= 1) return 0;
    for (int i = 2; i <= sqrt(n); i++) {
        if (n % i == 0) return 0;
    }
    return 1;
}

int main() {
    int start, end;
    printf("Enter the range (start and end): ");
    scanf("%d %d", &start, &end);

    printf("Prime numbers between %d and %d are:\n", start, end);
    for (int i = start; i <= end; i++) {
        if (isPrime(i))
            printf("%d ", i);
    }
    printf("\n");
    return 0;
}
`,
        logic:
          "The isPrime() function from the previous program is reused unchanged. A single loop walks the range and prints only those values for which isPrime() returns 1 — the filtering logic lives in one place instead of being duplicated.",
        concept:
          "Code reuse — one well-written function serving many call sites, a loop that calls a predicate per iteration, range iteration with <= so both bounds are inclusive.",
        workflow:
          "1. Read start and end → 2. loop i from start to end → 3. call isPrime(i) → 4. print i only when the result is 1 → 5. newline.",
      },
      {
        id: "l1q3",
        title: "Armstrong check with a function",
        question:
          "Write a C program with a function isArmstrong(n) that returns 1 if n is an Armstrong number (each digit raised to the power of the digit count, summed, equals n). Test it on a single number.",
        sampleInput: "153",
        lang: "c",
        code: String.raw`#include <stdio.h>
#include <math.h>

int isArmstrong(int n) {
    int original = n, sum = 0, digits = 0, temp;

    // Count number of digits
    temp = n;
    while (temp > 0) {
        digits++;
        temp /= 10;
    }

    // Calculate sum of digits raised to power of number of digits
    temp = n;
    while (temp > 0) {
        int digit = temp % 10;
        sum += pow(digit, digits);
        temp /= 10;
    }

    return (sum == original);
}

int main() {
    int num;
    printf("Enter a number: ");
    scanf("%d", &num);

    if (isArmstrong(num))
        printf("%d is an Armstrong number.\n", num);
    else
        printf("%d is NOT an Armstrong number.\n", num);

    return 0;
}
`,
        logic:
          "Two passes over a working copy: the first counts the digits, the second peels off each digit with % 10, raises it to the power of that digit count using pow(), and accumulates the sum. The comparison sum == original evaluates to 1 or 0, which is returned directly.",
        concept:
          "A function returning the result of a comparison expression, digit extraction with % 10 and / 10, pow() from <math.h>, two-pass algorithms (count first, then compute).",
        workflow:
          "1. Read num → 2. save original → 3. loop to count digits → 4. loop again summing pow(digit, digits) → 5. return sum == original → 6. print verdict.",
      },
      {
        id: "l1q4",
        title: "Reverse a number and test for palindrome",
        question:
          "Write a C program that reads a number, prints its reverse, and then reports whether the original number is a palindrome.",
        sampleInput: "12321",
        lang: "c",
        code: String.raw`#include <stdio.h>

int reverseNumber(int n) {
    int rev = 0;
    while (n > 0) {
        rev = rev * 10 + n % 10;
        n /= 10;
    }
    return rev;
}

int main() {
    int num, reversed;
    printf("Enter a number: ");
    scanf("%d", &num);

    reversed = reverseNumber(num);

    printf("Reversed number = %d\n", reversed);

    if (num == reversed)
        printf("%d is a Palindrome.\n", num);
    else
        printf("%d is NOT a Palindrome.\n", num);

    return 0;
}
`,
        logic:
          "Each iteration takes the last digit with % 10 and appends it to rev by multiplying rev by 10 first, while / 10 strips that digit from n. When n reaches 0 the reversal is complete. A number is a palindrome exactly when it equals its own reverse.",
        concept:
          "A function returning an int built up by accumulation, digit extraction and reconstruction (rev * 10 + n % 10), comparison of original vs derived value.",
        workflow:
          "1. Read num → 2. call reverseNumber(num) → 3. loop: rev = rev*10 + n%10, n /= 10 → 4. return rev → 5. compare num with reversed → 6. print verdict.",
      },
      {
        id: "l1q5",
        title: "Fibonacci with a void function",
        question:
          "Write a C program that generates the first n terms of the Fibonacci series (0, 1, 1, 2, 3, 5, …) using a void function that prints the series.",
        sampleInput: "10",
        lang: "c",
        code: String.raw`#include <stdio.h>

void fibonacci(int n) {
    int a = 0, b = 1, next;
    printf("Fibonacci Series: ");
    for (int i = 1; i <= n; i++) {
        printf("%d ", a);
        next = a + b;
        a = b;
        b = next;
    }
    printf("\n");
}

int main() {
    int terms;
    printf("Enter number of terms: ");
    scanf("%d", &terms);

    fibonacci(terms);
    return 0;
}
`,
        logic:
          "Two variables hold the current pair of terms. On every pass the current term a is printed, then the window slides forward: next holds the sum, a takes b's value and b takes next. The loop runs exactly n times so exactly n terms appear.",
        concept:
          "void functions that perform an action instead of returning a value, multi-variable update in one step, series generation with a sliding window, loop counter vs term value.",
        workflow:
          "1. Read terms → 2. call fibonacci(terms) → 3. loop n times: print a, compute next = a+b, shift a=b, b=next → 4. newline.",
      },
      {
        id: "l1q6",
        title: "Even and odd counter",
        question:
          "Write a C program that counts how many even and how many odd numbers lie between 1 and N using a function.",
        sampleInput: "10",
        lang: "c",
        code: String.raw`#include <stdio.h>

void countEvenOdd(int n) {
    int even = 0, odd = 0;
    for (int i = 1; i <= n; i++) {
        if (i % 2 == 0)
            even++;
        else
            odd++;
    }
    printf("Even numbers = %d\n", even);
    printf("Odd numbers  = %d\n", odd);
}

int main() {
    int n;
    printf("Enter N: ");
    scanf("%d", &n);

    countEvenOdd(n);
    return 0;
}
`,
        logic:
          "A single pass from 1 to N tests each value with % 2 == 0 and bumps exactly one of two counters. Because every integer is either even or odd, the two counters always add up to N — a useful self-check.",
        concept:
          "void function with its own local counters, the modulus operator as a parity test, mutually exclusive branches incrementing separate totals, loop bounds 1..N inclusive.",
        workflow:
          "1. Read N → 2. call countEvenOdd(N) → 3. loop i = 1..N → 4. if i % 2 == 0 even++ else odd++ → 5. print both totals.",
      },
      {
        id: "l1q7",
        title: "Menu-driven calculator",
        question:
          "Write a menu-driven C program that offers addition, subtraction, multiplication and division through separate functions, looping until the user chooses Exit. Handle division by zero.",
        sampleInput: "1\n5 3\n5",
        lang: "c",
        code: String.raw`#include <stdio.h>

float add(float a, float b)      { return a + b; }
float subtract(float a, float b) { return a - b; }
float multiply(float a, float b) { return a * b; }
float divide(float a, float b)   {
    if (b == 0) {
        printf("Error: Division by zero!\n");
        return 0;
    }
    return a / b;
}

int main() {
    float x, y, result;
    int choice;

    do {
        printf("\n----- Menu-Driven Calculator -----\n");
        printf("1. Addition\n");
        printf("2. Subtraction\n");
        printf("3. Multiplication\n");
        printf("4. Division\n");
        printf("5. Exit\n");
        printf("Enter your choice: ");
        scanf("%d", &choice);

        if (choice >= 1 && choice <= 4) {
            printf("Enter two numbers: ");
            scanf("%f %f", &x, &y);
        }

        switch (choice) {
            case 1: result = add(x, y);       printf("Result = %.2f\n", result); break;
            case 2: result = subtract(x, y);  printf("Result = %.2f\n", result); break;
            case 3: result = multiply(x, y);  printf("Result = %.2f\n", result); break;
            case 4: result = divide(x, y);    if (y != 0) printf("Result = %.2f\n", result); break;
            case 5: printf("Exiting...\n");   break;
            default: printf("Invalid choice!\n");
        }
    } while (choice != 5);

    return 0;
}
`,
        logic:
          "Each arithmetic operation is its own one-line function, so main() stays a dispatcher. A do-while loop guarantees the menu prints at least once and keeps repeating until the user picks 5. The operands are only read when the choice is a real operation, and the switch routes to the matching function.",
        concept:
          "Function-per-operation decomposition, do-while for menu loops (test at the bottom), switch-case with break and default, guarded input reading, division-by-zero check inside the function.",
        workflow:
          "1. print menu → 2. read choice → 3. if 1-4 read two floats → 4. switch on choice → 5. call the matching function and print → 6. repeat until choice == 5.",
      },
      {
        id: "l1q8",
        title: "Count duplicate elements in an array",
        question:
          "Write a C program that reads n elements and prints the total number of duplicate elements — counting every occurrence of any value that appears more than once, without double-counting.",
        sampleInput: "6\n1 2 3 2 4 1",
        lang: "c",
        code: String.raw`#include <stdio.h>

int main() {
    int n, i, j, count = 0;
    int arr[100];
    int visited[100] = {0};          // to mark already counted elements

    printf("Enter number of elements: ");
    scanf("%d", &n);

    printf("Enter %d elements:\n", n);
    for (i = 0; i < n; i++)
        scanf("%d", &arr[i]);

    for (i = 0; i < n; i++) {
        if (visited[i] == 1) continue;

        int freq = 1;
        for (j = i + 1; j < n; j++) {
            if (arr[i] == arr[j]) {
                freq++;
                visited[j] = 1;
            }
        }
        if (freq > 1)
            count += freq;           // all occurrences of this duplicate
    }

    printf("Total number of duplicate elements = %d\n", count);
    return 0;
}
`,
        logic:
          "For each position i, an inner scan counts every later equal element and marks those positions as visited so they are skipped as group leaders later. Only the first member of a run of equals does the counting, and when its frequency exceeds 1 the whole group's frequency is added to the total.",
        concept:
          "Parallel visited[] array as a bookkeeping flag, nested loops for pairwise comparison, avoiding double-counting by skipping already-consumed indices, frequency accumulation.",
        workflow:
          "1. Read n → 2. read the array → 3. for each unvisited i: count later matches, mark them visited → 4. if freq > 1 add freq to count → 5. print count.",
      },
      {
        id: "l1q9",
        title: "Copy one array into another",
        question:
          "Write a C program that reads n elements into a source array, copies them element-by-element into a destination array, and prints both arrays.",
        sampleInput: "4\n10 20 30 40",
        lang: "c",
        code: String.raw`#include <stdio.h>

int main() {
    int n, i;
    int source[100], destination[100];

    printf("Enter number of elements: ");
    scanf("%d", &n);

    printf("Enter %d elements of source array:\n", n);
    for (i = 0; i < n; i++)
        scanf("%d", &source[i]);

    // Copying
    for (i = 0; i < n; i++)
        destination[i] = source[i];

    printf("\nSource array      : ");
    for (i = 0; i < n; i++)
        printf("%d ", source[i]);

    printf("\nDestination array : ");
    for (i = 0; i < n; i++)
        printf("%d ", destination[i]);

    printf("\n");
    return 0;
}
`,
        logic:
          "Three separate loops share the same bound n: the first fills source[], the second assigns destination[i] = source[i] for every index, and the third prints. Because the copy is index-for-index, the two arrays end up independent — writing to one later would not change the other.",
        concept:
          "Element-by-element assignment as the basis of copying, two independent arrays of the same length, index-synchronised loops, fixed upper bound (100) on the declared size.",
        workflow:
          "1. Read n → 2. read n values into source[] → 3. loop i = 0..n-1 copying source[i] to destination[i] → 4. print source[] → 5. print destination[].",
      },
    ],
  },

  {
    id: "lab-2",
    name: "2 — Arrays, Strings & Structures",
    description:
      "Array reversal, hand-written string routines, ASCII classification and structs — simple, nested and arrays of structures.",
    items: [
      {
        id: "l2q1",
        title: "Reverse an array in place",
        question:
          "Write a C program that reads n elements into an array and reverses them in place, printing the reversed array.",
        sampleInput: "5\n1 2 3 4 5",
        lang: "c",
        code: String.raw`#include <stdio.h>

int main() {
    int n, i, temp;
    int arr[100];

    printf("Enter the number of elements: ");
    scanf("%d", &n);

    printf("Enter %d elements:\n", n);
    for (i = 0; i < n; i++)
        scanf("%d", &arr[i]);

    // Reverse the array
    for (i = 0; i < n / 2; i++) {
        temp = arr[i];
        arr[i] = arr[n - 1 - i];
        arr[n - 1 - i] = temp;
    }

    printf("\nReversed array: ");
    for (i = 0; i < n; i++)
        printf("%d ", arr[i]);
    printf("\n");

    return 0;
}
`,
        logic:
          "The loop only travels to the middle (n/2), pairing arr[i] with arr[n-1-i] and swapping them through a temporary. Elements already swapped are never revisited, so exactly ⌈n/2⌉ swaps reverse the whole array and no extra array is needed.",
        concept:
          "In-place reversal with a temporary, mirrored index arithmetic (n-1-i), integer division bounding the loop at the midpoint, why only half the passes are needed.",
        workflow:
          "1. Read n → 2. read n elements → 3. loop i = 0..n/2-1: swap arr[i] with arr[n-1-i] via temp → 4. print the array.",
      },
      {
        id: "l2q2",
        title: "String length without strlen()",
        question:
          "Write a C program that reads a string and prints its length without using any library function such as strlen().",
        sampleInput: "hello world",
        lang: "c",
        code: String.raw`#include <stdio.h>

int main() {
    char str[100];
    int length = 0, k;

    printf("Enter a string: ");
    fgets(str, sizeof(str), stdin);

    /* fgets keeps the trailing newline — drop it */
    for (k = 0; str[k] != '\0'; k++)
        if (str[k] == '\n') { str[k] = '\0'; break; }

    while (str[length] != '\0') {
        length++;
    }

    printf("Length of the string = %d\n", length);
    return 0;
}
`,
        logic:
          "Every C string ends with the null character '\\0'. Starting at index 0, the counter advances one position at a time and stops the moment it reaches that terminator — so the counter itself is the length. Space is counted, the newline is not, because it was stripped after reading.",
        concept:
          "Null-terminated strings and the '\\0' sentinel, walking an array with a while loop until a sentinel, fgets() replacing the removed gets() (bounded and safe), manual newline stripping.",
        workflow:
          "1. Read the line with fgets → 2. strip the newline fgets keeps → 3. increment length while str[length] != '\\0' → 4. print length.",
        note: "gets() was replaced by fgets() + a newline strip — gets() no longer exists in modern C.",
      },
      {
        id: "l2q3",
        title: "String comparison without strcmp()",
        question:
          "Write a C program that reads two strings and compares them character by character without using strcmp(), printing whether they are equal.",
        sampleInput: "apple\napple",
        lang: "c",
        code: String.raw`#include <stdio.h>

int main() {
    char str1[100], str2[100];
    int i = 0, flag = 0, k;

    printf("Enter first string: ");
    fgets(str1, sizeof(str1), stdin);
    printf("Enter second string: ");
    fgets(str2, sizeof(str2), stdin);

    /* fgets keeps the trailing newlines — drop them */
    for (k = 0; str1[k] != '\0'; k++)
        if (str1[k] == '\n') { str1[k] = '\0'; break; }
    for (k = 0; str2[k] != '\0'; k++)
        if (str2[k] == '\n') { str2[k] = '\0'; break; }

    while (str1[i] != '\0' || str2[i] != '\0') {
        if (str1[i] != str2[i]) {
            flag = 1;
            break;
        }
        i++;
    }

    if (flag == 0)
        printf("Strings are Equal.\n");
    else
        printf("Strings are NOT Equal.\n");

    return 0;
}
`,
        logic:
          "Characters are compared pairwise from index 0. A mismatch anywhere sets the flag and stops the loop immediately. If the loop runs to the end without a mismatch, both strings terminated at the same position — which means they are genuinely equal, not merely equal up to the shorter one.",
        concept:
          "Character-by-character comparison as strcmp() works internally, short-circuit break on first difference, the flag idiom for reporting from a scan, why both strings must end together.",
        workflow:
          "1. Read both lines → 2. strip both newlines → 3. loop while either string has characters → 4. break and set flag on first mismatch → 5. report from the flag.",
        note: "gets() was replaced by fgets() + a newline strip — gets() no longer exists in modern C.",
      },
      {
        id: "l2q4",
        title: "Classify characters in a string",
        question:
          "Write a C program that reads a string and counts how many alphabets, digits and special characters it contains, without using isalpha()/isdigit().",
        sampleInput: "abc123@#",
        lang: "c",
        code: String.raw`#include <stdio.h>

int main() {
    char str[200];
    int i, alphabets = 0, digits = 0, special = 0;

    printf("Enter a string: ");
    fgets(str, sizeof(str), stdin);

    /* fgets keeps the trailing newline — drop it */
    for (i = 0; str[i] != '\0'; i++)
        if (str[i] == '\n') { str[i] = '\0'; break; }

    for (i = 0; str[i] != '\0'; i++) {
        if ((str[i] >= 'a' && str[i] <= 'z') || (str[i] >= 'A' && str[i] <= 'Z'))
            alphabets++;
        else if (str[i] >= '0' && str[i] <= '9')
            digits++;
        else
            special++;
    }

    printf("Alphabets      = %d\n", alphabets);
    printf("Digits         = %d\n", digits);
    printf("Special chars  = %d\n", special);

    return 0;
}
`,
        logic:
          "Each character is tested against ASCII ranges: a–z or A–Z means alphabet, 0–9 means digit, and everything else falls through to special. Because the branches are exclusive and the final one is an else, every character is counted exactly once and the three totals equal the string length.",
        concept:
          "ASCII range comparisons for classification (the manual equivalent of isalpha()/isdigit()), exclusive if / else-if / else chains, single-pass categorisation, reading with fgets instead of the removed gets().",
        workflow:
          "1. Read the line → 2. strip the newline → 3. loop over every character → 4. classify by ASCII range and increment the matching counter → 5. print all three totals.",
        note: "gets() was replaced by fgets() + a newline strip — gets() no longer exists in modern C.",
      },
      {
        id: "l2q5",
        title: "Lowercase to uppercase",
        question:
          "Write a C program that reads a string and converts every lowercase letter to uppercase by adjusting its ASCII value.",
        sampleInput: "ppl lab",
        lang: "c",
        code: String.raw`#include <stdio.h>

int main() {
    char str[200];
    int i;

    printf("Enter a string: ");
    fgets(str, sizeof(str), stdin);

    /* fgets keeps the trailing newline — drop it */
    for (i = 0; str[i] != '\0'; i++)
        if (str[i] == '\n') { str[i] = '\0'; break; }

    for (i = 0; str[i] != '\0'; i++) {
        if (str[i] >= 'a' && str[i] <= 'z') {
            str[i] = str[i] - 32;   // convert to uppercase
        }
    }

    printf("Uppercase string: %s\n", str);
    return 0;
}
`,
        logic:
          "In ASCII the gap between a lowercase letter and its uppercase form is exactly 32 ('a' − 'A' = 32). Subtracting 32 moves any character from the lowercase block to the uppercase block. Characters already uppercase, digits and spaces fall outside the test and pass through untouched.",
        concept:
          "ASCII arithmetic for case conversion, the fixed offset of 32 between cases, modifying a string in place through array indexing, conditionally transforming only a target range.",
        workflow:
          "1. Read the line → 2. strip the newline → 3. loop over each character → 4. if it is between 'a' and 'z', subtract 32 → 5. print the modified string.",
        note: "gets() was replaced by fgets() + a newline strip — gets() no longer exists in modern C.",
      },
      {
        id: "l2q6",
        title: "Book structure",
        question:
          "Define a structure Book with id, name, author, price, year, pages and publisher. Read all fields for one book and display them in a formatted block.",
        sampleInput: "101\nClean Code\nRobert Martin\n450.50\n2008\n464\nPrentice Hall",
        lang: "c",
        code: String.raw`#include <stdio.h>

struct Book {
    int bookid;
    char bookname[50];
    char author[50];
    float price;
    int year;
    int pages;
    char publisher[50];
};

int main() {
    struct Book b;
    int k;

    printf("Enter Book ID: ");
    scanf("%d", &b.bookid);
    getchar();                          // clear newline

    printf("Enter Book Name: ");
    fgets(b.bookname, sizeof(b.bookname), stdin);

    printf("Enter Author: ");
    fgets(b.author, sizeof(b.author), stdin);

    printf("Enter Price: ");
    scanf("%f", &b.price);

    printf("Enter Year: ");
    scanf("%d", &b.year);
    printf("Enter Pages: ");
    scanf("%d", &b.pages);
    getchar();

    printf("Enter Publisher: ");
    fgets(b.publisher, sizeof(b.publisher), stdin);

    /* fgets keeps the trailing newlines — drop them */
    for (k = 0; b.bookname[k] != '\0'; k++)
        if (b.bookname[k] == '\n') { b.bookname[k] = '\0'; break; }
    for (k = 0; b.author[k] != '\0'; k++)
        if (b.author[k] == '\n') { b.author[k] = '\0'; break; }
    for (k = 0; b.publisher[k] != '\0'; k++)
        if (b.publisher[k] == '\n') { b.publisher[k] = '\0'; break; }

    printf("\n----- Book Details -----\n");
    printf("Book ID    : %d\n", b.bookid);
    printf("Book Name  : %s\n", b.bookname);
    printf("Author     : %s\n", b.author);
    printf("Price      : %.2f\n", b.price);
    printf("Year       : %d\n", b.year);
    printf("Pages      : %d\n", b.pages);
    printf("Publisher  : %s\n", b.publisher);

    return 0;
}
`,
        logic:
          "A struct bundles seven different fields into a single named record, so one variable b carries the whole book. Numeric fields are read with scanf; the three name fields are read as whole lines so spaces survive. getchar() clears the newline left behind by scanf before any fgets call reads the following line.",
        concept:
          "struct as a user-defined composite type, the dot operator for member access, mixing scanf with fgets (and the getchar() handshake that makes it safe), formatted printing with %.2f.",
        workflow:
          "1. Declare struct Book b → 2. read id → 3. getchar() to clear the newline → 4. read the three text fields with fgets → 5. read price/year/pages → 6. strip newlines → 7. print the record.",
        note: "gets() was replaced by fgets() + a newline strip — gets() no longer exists in modern C.",
      },
      {
        id: "l2q7",
        title: "Nested structure for an employee",
        question:
          "Define a structure Salary (basic, da, hra, cca) and a structure Employee that contains a Salary member. Read one employee, compute gross salary and display the record.",
        sampleInput: "1001\nRavi Kumar\n40000\n12000\n8000\n3000",
        lang: "c",
        code: String.raw`#include <stdio.h>

struct Salary {
    float basicpay;
    float da;
    float hra;
    float cca;
};

struct Employee {
    int empid;
    char empname[50];
    struct Salary sal;          // nested structure
};

int main() {
    struct Employee e;
    float gross;
    int k;

    printf("Enter Employee ID: ");
    scanf("%d", &e.empid);
    getchar();

    printf("Enter Employee Name: ");
    fgets(e.empname, sizeof(e.empname), stdin);

    printf("Enter Basic Pay: ");
    scanf("%f", &e.sal.basicpay);
    printf("Enter DA: ");
    scanf("%f", &e.sal.da);
    printf("Enter HRA: ");
    scanf("%f", &e.sal.hra);
    printf("Enter CCA: ");
    scanf("%f", &e.sal.cca);

    /* fgets keeps the trailing newline — drop it */
    for (k = 0; e.empname[k] != '\0'; k++)
        if (e.empname[k] == '\n') { e.empname[k] = '\0'; break; }

    gross = e.sal.basicpay + e.sal.da + e.sal.hra + e.sal.cca;

    printf("\n----- Employee Details -----\n");
    printf("Employee ID   : %d\n", e.empid);
    printf("Employee Name : %s\n", e.empname);
    printf("Basic Pay     : %.2f\n", e.sal.basicpay);
    printf("DA            : %.2f\n", e.sal.da);
    printf("HRA           : %.2f\n", e.sal.hra);
    printf("CCA           : %.2f\n", e.sal.cca);
    printf("Gross Salary  : %.2f\n", gross);

    return 0;
}
`,
        logic:
          "Salary is declared first and then embedded as a member of Employee, so one Employee object carries an ID, a name and a whole salary package. Members are reached with the dot operator twice (e.sal.basicpay). Gross salary is simply the sum of the four components of that package.",
        concept:
          "Nested structures for hierarchical real-world data, chained dot access e.sal.member, declaring a struct before embedding it, deriving gross pay from the grouped fields.",
        workflow:
          "1. Declare Employee e (which contains Salary sal) → 2. read id → 3. getchar() then fgets for the name → 4. read the four salary components → 5. strip the newline → 6. sum into gross → 7. print.",
        note: "gets() was replaced by fgets() + a newline strip — gets() no longer exists in modern C.",
      },
      {
        id: "l2q8",
        title: "Array of structures for 5 students",
        question:
          "Define a structure Student (roll, name, marks) and create an array of 5. Read all records, display them in a table, then print the average marks and the student with the highest marks.",
        sampleInput:
          "101\nAnanya\n88.5\n102\nRohan\n92\n103\nPriya\n76.5\n104\nVikram\n92\n105\nSneha\n81",
        lang: "c",
        code: String.raw`#include <stdio.h>

struct Student {
    int roll;
    char name[50];
    float marks;
};

int main() {
    struct Student s[5];
    int i, k, maxIndex = 0;
    float sum = 0, average;

    // 1. Accept data
    for (i = 0; i < 5; i++) {
        printf("\nEnter details of Student %d\n", i + 1);
        printf("Roll Number: ");
        scanf("%d", &s[i].roll);
        getchar();

        printf("Name: ");
        fgets(s[i].name, sizeof(s[i].name), stdin);
        printf("Marks: ");
        scanf("%f", &s[i].marks);

        /* fgets keeps the trailing newline — drop it */
        for (k = 0; s[i].name[k] != '\0'; k++)
            if (s[i].name[k] == '\n') { s[i].name[k] = '\0'; break; }
    }

    // 2. Display in tabular form
    printf("\n------------------------------------------------\n");
    printf("Roll No\t\tName\t\t\tMarks\n");
    printf("------------------------------------------------\n");
    for (i = 0; i < 5; i++) {
        printf("%d\t\t%-20s\t%.2f\n", s[i].roll, s[i].name, s[i].marks);
        sum += s[i].marks;

        if (s[i].marks > s[maxIndex].marks)
            maxIndex = i;
    }
    printf("------------------------------------------------\n");

    // 3. Average marks
    average = sum / 5;
    printf("\nAverage Marks of 5 students = %.2f\n", average);

    // 4. Student with highest marks
    printf("\nStudent with Highest Marks:\n");
    printf("Roll No : %d\n", s[maxIndex].roll);
    printf("Name    : %s\n", s[maxIndex].name);
    printf("Marks   : %.2f\n", s[maxIndex].marks);

    return 0;
}
`,
        logic:
          "One array s[5] holds five complete records, so a single index accesses any field of any student (s[i].marks). Input runs in one loop; the display loop simultaneously prints a formatted table, accumulates the sum for the average, and tracks the index of the highest score — one pass doing all three.",
        concept:
          "Array of structures for many same-shaped records, single-pass min/max tracking with a running index, tabular printf formatting (%-20s, \\t), computing an average from an accumulated sum.",
        workflow:
          "1. loop i = 0..4 reading roll, name, marks → 2. strip each newline → 3. loop again: print row, add to sum, update maxIndex → 4. average = sum / 5 → 5. print average → 6. print s[maxIndex].",
        note: "gets() was replaced by fgets() + a newline strip — gets() no longer exists in modern C.",
      },
    ],
  },
];
