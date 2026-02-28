#include <iostream>
#include <string>
#include <vector>

// 简单的 C++ 程序示例
class HelloWorld {
private:
    std::string message;

public:
    HelloWorld(const std::string& msg = "Hello, World!") : message(msg) {}

    void greet() {
        std::cout << message << std::endl;
    }

    void set_message(const std::string& msg) {
        message = msg;
    }
};

int main() {
    HelloWorld hello;
    hello.greet();

    hello.set_message("欢迎使用 GitHub!");
    hello.greet();

    return 0;
}