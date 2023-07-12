import java.util.*;
public class  Main {
    public static String addNum(String a, String b) {
        
        return String.valueOf((Integer.parseInt(a)+Integer.parseInt(b)));
    }

    public static void main(String[] args) {
         Scanner sc =new Scanner(System.in);
          String a=sc.nextLine();
          String b=sc.nextLine();
        String result = addNum(a,b);
        System.out.println("The Sum of the two String is " + result);
    }
}

// Test Cases:

// 24
// 42
// The Sum of the two String is 66

// 9999
// 1
// The Sum of the two String is 10000