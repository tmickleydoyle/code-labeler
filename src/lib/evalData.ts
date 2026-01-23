// Evaluation test cases for the code classifier
// Parsed from the evaluation shell script

export type Tier = "baseline" | "hard" | "super_hard" | "extreme";

export interface TestCase {
  id: string;
  language: string;
  code: string;
  description: string;
  tier: Tier;
}

export const testCases: TestCase[] = [
  // ============================================================
  // PYTHON - Baseline
  // ============================================================
  {
    id: "py_short",
    language: "Python",
    code: `print("Hello, World!")`,
    description: "Simple print statement",
    tier: "baseline",
  },
  {
    id: "py_medium",
    language: "Python",
    code: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)`,
    description: "Recursive fibonacci function",
    tier: "baseline",
  },
  {
    id: "py_long",
    language: "Python",
    code: `@dataclass
class User:
    name: str
    email: str

    async def save(self, db: AsyncSession) -> None:
        db.add(self)
        await db.commit()

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "User":
        return cls(**data)`,
    description: "Dataclass with async method",
    tier: "baseline",
  },
  {
    id: "py_comprehension",
    language: "Python",
    code: `squares = [x**2 for x in range(10) if x % 2 == 0]
nested = {k: v for k, v in zip(keys, values)}`,
    description: "List and dict comprehensions",
    tier: "baseline",
  },
  {
    id: "py_decorator",
    language: "Python",
    code: `def log_calls(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        print(f"Calling {func.__name__}")
        return func(*args, **kwargs)
    return wrapper

@log_calls
def greet(name):
    return f"Hello, {name}"`,
    description: "Decorator pattern",
    tier: "baseline",
  },
  {
    id: "py_context_manager",
    language: "Python",
    code: `class DatabaseConnection:
    def __enter__(self):
        self.conn = create_connection()
        return self.conn

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.conn.close()
        return False

with DatabaseConnection() as conn:
    conn.execute("SELECT 1")`,
    description: "Context manager implementation",
    tier: "baseline",
  },

  // ============================================================
  // JAVASCRIPT - Baseline
  // ============================================================
  {
    id: "js_short",
    language: "JavaScript",
    code: `const x = 5;
console.log(x);`,
    description: "Variable declaration and logging",
    tier: "baseline",
  },
  {
    id: "js_medium",
    language: "JavaScript",
    code: `function debounce(fn, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), delay);
    };
}`,
    description: "Debounce utility function",
    tier: "baseline",
  },
  {
    id: "js_long",
    language: "JavaScript",
    code: `class EventEmitter {
    constructor() {
        this.events = new Map();
    }
    on(event, callback) {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        this.events.get(event).push(callback);
        return () => this.off(event, callback);
    }
    emit(event, ...args) {
        const callbacks = this.events.get(event) || [];
        callbacks.forEach(cb => cb.apply(this, args));
    }
}`,
    description: "EventEmitter class implementation",
    tier: "baseline",
  },
  {
    id: "js_async_await",
    language: "JavaScript",
    code: `async function fetchUserData(userId) {
    try {
        const response = await fetch(\`/api/users/\${userId}\`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch:", error);
    }
}`,
    description: "Async/await with error handling",
    tier: "baseline",
  },
  {
    id: "js_destructuring",
    language: "JavaScript",
    code: `const { name, age, address: { city } } = user;
const [first, second, ...rest] = items;
const merged = { ...defaults, ...options };
console.log(name, city);
module.exports = { merged };`,
    description: "Destructuring and spread operators",
    tier: "baseline",
  },
  {
    id: "js_spread_arrow",
    language: "JavaScript",
    code: `const multiply = (...nums) => nums.reduce((a, b) => a * b, 1);
const clone = obj => ({ ...obj });
const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);`,
    description: "Arrow functions with spread",
    tier: "baseline",
  },

  // ============================================================
  // TYPESCRIPT - Baseline
  // ============================================================
  {
    id: "ts_short",
    language: "TypeScript",
    code: `const greeting: string = "Hello";
const count: number = 42;`,
    description: "Type annotations",
    tier: "baseline",
  },
  {
    id: "ts_medium",
    language: "TypeScript",
    code: `interface User {
    id: number;
    name: string;
    email?: string;
}

function getUser(id: number): Promise<User> {
    return fetch(\`/api/users/\${id}\`).then(r => r.json());
}`,
    description: "Interface and typed function",
    tier: "baseline",
  },
  {
    id: "ts_long",
    language: "TypeScript",
    code: `interface IUser {
    readonly id: number;
    name: string;
    email?: string;
}

class UserService implements IUserService {
    private users: IUser[] = [];

    public async getUser(id: number): Promise<IUser | undefined> {
        return this.users.find((u: IUser): boolean => u.id === id);
    }

    public addUser(user: IUser): void {
        this.users.push(user);
    }

    public getNames(): string[] {
        return this.users.map((u: IUser): string => u.name);
    }
}

interface IUserService {
    getUser(id: number): Promise<IUser | undefined>;
    addUser(user: IUser): void;
}

const service: IUserService = new UserService();`,
    description: "Class implementing interface",
    tier: "baseline",
  },
  {
    id: "ts_mapped_types",
    language: "TypeScript",
    code: `interface IUser {
    id: number;
    name: string;
    email: string;
}

type MyReadonly<T> = { readonly [K in keyof T]: T[K] };
type MyPartial<T> = { [K in keyof T]?: T[K] };

class UserStore {
    private users: Map<number, IUser> = new Map();

    public add(user: IUser): void {
        this.users.set(user.id, user);
    }

    public get(id: number): IUser | undefined {
        return this.users.get(id);
    }

    public update(id: number, partial: MyPartial<IUser>): IUser | undefined {
        const user: IUser | undefined = this.users.get(id);
        if (user) {
            const updated: IUser = { ...user, ...partial };
            this.users.set(id, updated);
            return updated;
        }
        return undefined;
    }
}

export { IUser, UserStore };`,
    description: "Mapped types and generics",
    tier: "baseline",
  },
  {
    id: "ts_conditional_types",
    language: "TypeScript",
    code: `type IsArray<T> = T extends any[] ? true : false;
type Unwrap<T> = T extends Promise<infer U> ? U : T;
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;`,
    description: "Conditional and infer types",
    tier: "baseline",
  },
  {
    id: "ts_decorators",
    language: "TypeScript",
    code: `function sealed(constructor: Function): void {
    Object.seal(constructor);
    Object.seal(constructor.prototype);
}

function log(target: object, key: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    const original: Function = descriptor.value;
    descriptor.value = function(...args: unknown[]): unknown {
        console.log(\`Calling \${key}\`);
        return original.apply(this, args);
    };
    return descriptor;
}

@sealed
class Example {
    private message: string = "Hello";
    @log
    greet(name: string): string { return \`\${this.message}, \${name}\`; }
}`,
    description: "Class and method decorators",
    tier: "baseline",
  },

  // ============================================================
  // GO - Baseline
  // ============================================================
  {
    id: "go_short",
    language: "GO",
    code: `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`,
    description: "Hello World",
    tier: "baseline",
  },
  {
    id: "go_medium",
    language: "GO",
    code: `func sum(nums []int) int {
    total := 0
    for _, n := range nums {
        total += n
    }
    return total
}`,
    description: "Sum function with range",
    tier: "baseline",
  },
  {
    id: "go_long",
    language: "GO",
    code: `package main

import (
    "context"
    "sync"
)

type Server struct {
    mu    sync.RWMutex
    conns map[string]*Connection
    done  chan struct{}
}

func (s *Server) Handle(ctx context.Context, conn net.Conn) error {
    defer conn.Close()
    s.mu.Lock()
    s.conns[conn.RemoteAddr().String()] = &Connection{conn: conn}
    s.mu.Unlock()

    go func() {
        <-ctx.Done()
        s.done <- struct{}{}
    }()

    select {
    case <-ctx.Done():
        return ctx.Err()
    case <-s.done:
        return nil
    }
}`,
    description: "Concurrent server with mutex",
    tier: "baseline",
  },
  {
    id: "go_goroutine",
    language: "GO",
    code: `func worker(jobs <-chan int, results chan<- int) {
    for j := range jobs {
        results <- j * 2
    }
}

func main() {
    jobs := make(chan int, 100)
    results := make(chan int, 100)

    go worker(jobs, results)
    jobs <- 1
    close(jobs)
    fmt.Println(<-results)
}`,
    description: "Worker goroutine pattern",
    tier: "baseline",
  },
  {
    id: "go_channel",
    language: "GO",
    code: `package main

import "fmt"

func producer(ch chan<- int) {
    for i := 0; i < 5; i++ {
        ch <- i
    }
    close(ch)
}

func consumer(ch <-chan int) {
    for val := range ch {
        fmt.Println(val)
    }
}

func main() {
    ch := make(chan int)
    go producer(ch)
    consumer(ch)
}`,
    description: "Producer-consumer with channels",
    tier: "baseline",
  },
  {
    id: "go_interface",
    language: "GO",
    code: `type Reader interface {
    Read(p []byte) (n int, err error)
}

type Writer interface {
    Write(p []byte) (n int, err error)
}

type ReadWriter interface {
    Reader
    Writer
}

type FileHandler struct{}

func (f *FileHandler) Read(p []byte) (n int, err error) {
    return len(p), nil
}

func (f *FileHandler) Write(p []byte) (n int, err error) {
    return len(p), nil
}`,
    description: "Interface composition",
    tier: "baseline",
  },

  // ============================================================
  // RUST - Baseline
  // ============================================================
  {
    id: "rust_short",
    language: "Rust",
    code: `fn main() {
    println!("Hello, world!");
}`,
    description: "Hello World with println! macro",
    tier: "baseline",
  },
  {
    id: "rust_medium",
    language: "Rust",
    code: `fn fibonacci(n: u32) -> u32 {
    match n {
        0 => 0,
        1 => 1,
        _ => fibonacci(n - 1) + fibonacci(n - 2),
    }
}`,
    description: "Pattern matching fibonacci",
    tier: "baseline",
  },
  {
    id: "rust_long",
    language: "Rust",
    code: `use std::collections::HashMap;

pub struct Cache<K, V> {
    store: HashMap<K, V>,
    max_size: usize,
}

impl<K: Eq + std::hash::Hash, V: Clone> Cache<K, V> {
    pub fn get(&self, key: &K) -> Option<V> {
        self.store.get(key).cloned()
    }

    pub fn insert(&mut self, key: K, value: V) -> Result<(), &str> {
        if self.store.len() >= self.max_size {
            return Err("Cache full");
        }
        self.store.insert(key, value);
        Ok(())
    }
}`,
    description: "Generic cache implementation",
    tier: "baseline",
  },
  {
    id: "rust_lifetime",
    language: "Rust",
    code: `fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}

struct Excerpt<'a> {
    part: &'a str,
}

impl<'a> Excerpt<'a> {
    fn level(&self) -> i32 { 3 }
    fn announce(&self, msg: &str) -> &str { self.part }
}`,
    description: "Lifetime annotations",
    tier: "baseline",
  },
  {
    id: "rust_trait_impl",
    language: "Rust",
    code: `trait Summary {
    fn summarize(&self) -> String;
    fn default_summary(&self) -> String {
        String::from("(Read more...)")
    }
}

struct Article { title: String, content: String }

impl Summary for Article {
    fn summarize(&self) -> String {
        format!("{}: {}", self.title, &self.content[..50])
    }
}`,
    description: "Trait implementation",
    tier: "baseline",
  },
  {
    id: "rust_macro",
    language: "Rust",
    code: `use std::collections::HashMap;

macro_rules! vec_of_strings {
    ($($x:expr),*) => {
        vec![$($x.to_string()),*]
    };
}

macro_rules! hashmap {
    ($($key:expr => $value:expr),* $(,)?) => {{
        let mut map: HashMap<&str, &str> = HashMap::new();
        $(map.insert($key, $value);)*
        map
    }};
}

fn main() {
    let v: Vec<String> = vec_of_strings!["a", "b", "c"];
    let m: HashMap<&str, &str> = hashmap!{ "key" => "value" };
    println!("{:?}", v);
    println!("{:?}", m);
}`,
    description: "Custom macro definitions",
    tier: "baseline",
  },

  // ============================================================
  // JAVA - Baseline
  // ============================================================
  {
    id: "java_short",
    language: "Java",
    code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
    description: "Hello World",
    tier: "baseline",
  },
  {
    id: "java_medium",
    language: "Java",
    code: `public class Calculator {
    public int add(int a, int b) {
        return a + b;
    }

    public int multiply(int a, int b) {
        return a * b;
    }
}`,
    description: "Simple calculator class",
    tier: "baseline",
  },
  {
    id: "java_long",
    language: "Java",
    code: `public class UserService {
    private final UserRepository repository;

    @Autowired
    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public Optional<User> findById(Long id) {
        return repository.findById(id);
    }

    @Transactional
    public User save(User user) {
        return repository.save(user);
    }
}`,
    description: "Spring service with DI",
    tier: "baseline",
  },
  {
    id: "java_stream",
    language: "Java",
    code: `import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class StreamExample {
    public static void main(String[] args) {
        List<String> filtered = users.stream()
            .filter(u -> u.isActive())
            .map(User::getName)
            .sorted()
            .collect(Collectors.toList());

        Map<String, Long> counts = items.stream()
            .collect(Collectors.groupingBy(Item::getCategory, Collectors.counting()));

        System.out.println(filtered);
    }
}`,
    description: "Stream API operations",
    tier: "baseline",
  },
  {
    id: "java_lambda",
    language: "Java",
    code: `Comparator<Person> comparator = (p1, p2) -> p1.getAge() - p2.getAge();
Function<String, Integer> parser = Integer::parseInt;
Predicate<String> isEmpty = String::isEmpty;
Consumer<String> printer = System.out::println;`,
    description: "Lambda expressions and method references",
    tier: "baseline",
  },
  {
    id: "java_record",
    language: "Java",
    code: `public record Person(String name, int age) {
    public Person {
        if (age < 0) throw new IllegalArgumentException("Age cannot be negative");
    }

    public String greeting() {
        return "Hello, " + name;
    }
}

var person = new Person("Alice", 30);
System.out.println(person.name());`,
    description: "Record type with compact constructor",
    tier: "baseline",
  },

  // ============================================================
  // C - Baseline
  // ============================================================
  {
    id: "c_short",
    language: "C",
    code: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
    description: "Hello World",
    tier: "baseline",
  },
  {
    id: "c_medium",
    language: "C",
    code: `int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}`,
    description: "Recursive factorial",
    tier: "baseline",
  },
  {
    id: "c_long",
    language: "C",
    code: `#include <stdlib.h>

typedef struct Node {
    int data;
    struct Node* next;
} Node;

Node* create_node(int data) {
    Node* node = (Node*)malloc(sizeof(Node));
    node->data = data;
    node->next = NULL;
    return node;
}

void insert(Node** head, int data) {
    Node* new_node = create_node(data);
    new_node->next = *head;
    *head = new_node;
}`,
    description: "Linked list implementation",
    tier: "baseline",
  },
  {
    id: "c_macro",
    language: "C",
    code: `#define MAX(a, b) ((a) > (b) ? (a) : (b))
#define ARRAY_SIZE(arr) (sizeof(arr) / sizeof((arr)[0]))
#define STRINGIFY(x) #x
#define CONCAT(a, b) a##b

int values[] = {1, 2, 3, 4, 5};
int max = MAX(values[0], values[1]);
size_t len = ARRAY_SIZE(values);`,
    description: "Preprocessor macros",
    tier: "baseline",
  },
  {
    id: "c_pointer",
    language: "C",
    code: `void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int sum_array(int *arr, size_t n) {
    int *end = arr + n;
    int sum = 0;
    while (arr < end) {
        sum += *arr++;
    }
    return sum;
}`,
    description: "Pointer arithmetic",
    tier: "baseline",
  },
  {
    id: "c_union",
    language: "C",
    code: `union Value {
    int i;
    float f;
    char c;
};

struct Variant {
    enum { INT, FLOAT, CHAR } type;
    union Value value;
};

void print_variant(struct Variant v) {
    switch (v.type) {
        case INT: printf("%d", v.value.i); break;
        case FLOAT: printf("%f", v.value.f); break;
        case CHAR: printf("%c", v.value.c); break;
    }
}`,
    description: "Union and enum variant",
    tier: "baseline",
  },

  // ============================================================
  // C++ - Baseline
  // ============================================================
  {
    id: "cpp_short",
    language: "C++",
    code: `#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`,
    description: "Hello World with iostream",
    tier: "baseline",
  },
  {
    id: "cpp_medium",
    language: "C++",
    code: `class Rectangle {
public:
    Rectangle(int w, int h) : width(w), height(h) {}
    int area() const { return width * height; }
private:
    int width, height;
};`,
    description: "Class with constructor initializer",
    tier: "baseline",
  },
  {
    id: "cpp_long",
    language: "C++",
    code: `template<typename T>
class SmartPtr {
public:
    explicit SmartPtr(T* ptr = nullptr) : ptr_(ptr) {}
    ~SmartPtr() { delete ptr_; }

    SmartPtr(SmartPtr&& other) noexcept : ptr_(other.ptr_) {
        other.ptr_ = nullptr;
    }

    T& operator*() const { return *ptr_; }
    T* operator->() const { return ptr_; }

private:
    T* ptr_;
};`,
    description: "Smart pointer template",
    tier: "baseline",
  },
  {
    id: "cpp_template_spec",
    language: "C++",
    code: `#include <string>
#include <iostream>

template<typename T>
class Serializer {
public:
    static std::string serialize(const T& value);
};

template<>
class Serializer<std::string> {
public:
    static std::string serialize(const std::string& value) {
        return "\\"" + value + "\\"";
    }

    static std::string deserialize(const std::string& data) {
        return data.substr(1, data.length() - 2);
    }
};

int main() {
    std::cout << Serializer<std::string>::serialize("hello") << std::endl;
    return 0;
}`,
    description: "Template specialization",
    tier: "baseline",
  },
  {
    id: "cpp_lambda",
    language: "C++",
    code: `auto sum = [](auto... args) { return (args + ...); };
auto multiply = [](int x, int y) -> int { return x * y; };

std::vector<int> nums = {1, 2, 3, 4, 5};
std::transform(nums.begin(), nums.end(), nums.begin(),
    [factor = 2](int n) { return n * factor; });`,
    description: "Lambda expressions with capture",
    tier: "baseline",
  },
  {
    id: "cpp_concepts",
    language: "C++",
    code: `template<typename T>
concept Numeric = std::integral<T> || std::floating_point<T>;

template<Numeric T>
T add(T a, T b) { return a + b; }

template<typename T>
requires std::is_arithmetic_v<T>
T multiply(T a, T b) { return a * b; }`,
    description: "C++20 concepts",
    tier: "baseline",
  },

  // ============================================================
  // C# - Baseline
  // ============================================================
  {
    id: "csharp_short",
    language: "C#",
    code: `using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello, World!");
    }
}`,
    description: "Hello World",
    tier: "baseline",
  },
  {
    id: "csharp_medium",
    language: "C#",
    code: `public class Person {
    public string Name { get; set; }
    public int Age { get; set; }

    public void Greet() {
        Console.WriteLine($"Hello, my name is {Name}");
    }
}`,
    description: "Auto-properties and interpolation",
    tier: "baseline",
  },
  {
    id: "csharp_long",
    language: "C#",
    code: `using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace MyApp.Data
{
    public interface IRepository<T> where T : class {
        Task<T?> GetByIdAsync(int id);
        Task<IEnumerable<T>> GetAllAsync();
        Task AddAsync(T entity);
    }

    public class UserRepository : IRepository<User> {
        private readonly DbContext _context;

        public async Task<User?> GetByIdAsync(int id) {
            return await _context.Users.FindAsync(id);
        }
    }
}`,
    description: "Generic repository pattern",
    tier: "baseline",
  },
  {
    id: "csharp_linq",
    language: "C#",
    code: `using System;
using System.Linq;
using System.Collections.Generic;

class Program {
    static void Main() {
        var adults = from user in users
                      where user.Age >= 18
                      orderby user.Name
                      select new { user.Name, user.Email };

        var grouped = users.GroupBy(u => u.Department)
                          .Select(g => new { Dept = g.Key, Count = g.Count() });

        Console.WriteLine($"Found {adults.Count()} adults");
    }
}`,
    description: "LINQ query syntax",
    tier: "baseline",
  },
  {
    id: "csharp_record",
    language: "C#",
    code: `using System;

namespace MyApp.Models
{
    public record Person(string Name, int Age);

    public record Employee(string Name, int Age, string Department) : Person(Name, Age);

    class Program {
        static void Main() {
            var person = new Person("Alice", 30);
            var updated = person with { Age = 31 };
            Console.WriteLine($"Original: {person}, Updated: {updated}");
        }
    }
}`,
    description: "Record types with inheritance",
    tier: "baseline",
  },
  {
    id: "csharp_pattern",
    language: "C#",
    code: `using System;

class PatternMatching
{
    public static string Classify(object obj) => obj switch
    {
        int i when i < 0 => "negative",
        int i when i > 0 => "positive",
        int => "zero",
        string { Length: > 10 } => "long string",
        string => "short string",
        null => "null",
        _ => "unknown"
    };

    static void Main() {
        Console.WriteLine(Classify(42));
        Console.WriteLine(Classify("Hello, World!"));
    }
}`,
    description: "Pattern matching switch",
    tier: "baseline",
  },

  // ============================================================
  // RUBY - Baseline
  // ============================================================
  {
    id: "ruby_short",
    language: "Ruby",
    code: `puts "Hello, World!"`,
    description: "Hello World",
    tier: "baseline",
  },
  {
    id: "ruby_medium",
    language: "Ruby",
    code: `class Person
  attr_accessor :name, :age

  def initialize(name, age)
    @name = name
    @age = age
  end

  def greet
    "Hello, my name is #{@name}"
  end
end`,
    description: "Class with attr_accessor",
    tier: "baseline",
  },
  {
    id: "ruby_long",
    language: "Ruby",
    code: `class ApplicationController < ActionController::Base
  before_action :authenticate_user!

  rescue_from ActiveRecord::RecordNotFound do |e|
    render json: { error: e.message }, status: :not_found
  end

  private

  def current_user
    @current_user ||= User.find_by(id: session[:user_id])
  end
end`,
    description: "Rails controller",
    tier: "baseline",
  },
  {
    id: "ruby_block",
    language: "Ruby",
    code: `[1, 2, 3].each { |n| puts n }
result = numbers.map(&:to_s).join(", ")
File.open("file.txt") do |f|
  f.each_line { |line| process(line) }
end`,
    description: "Block syntax patterns",
    tier: "baseline",
  },
  {
    id: "ruby_mixin",
    language: "Ruby",
    code: `module Loggable
  def log(message)
    puts "[#{Time.now}] #{message}"
  end
end

class Service
  include Loggable
  extend Loggable

  def call
    log("Service called")
  end
end`,
    description: "Module mixins",
    tier: "baseline",
  },
  {
    id: "ruby_method_missing",
    language: "Ruby",
    code: `class DynamicFinder
  def method_missing(method_name, *args, &block)
    if method_name.to_s.start_with?("find_by_")
      attribute = method_name.to_s.sub("find_by_", "")
      find_by_attribute(attribute, args.first)
    else
      super
    end
  end

  def respond_to_missing?(method_name, include_private = false)
    method_name.to_s.start_with?("find_by_") || super
  end
end`,
    description: "Dynamic method handling",
    tier: "baseline",
  },

  // ============================================================
  // PHP - Baseline
  // ============================================================
  {
    id: "php_short",
    language: "PHP",
    code: `<?php
echo "Hello, World!";
?>`,
    description: "Hello World",
    tier: "baseline",
  },
  {
    id: "php_medium",
    language: "PHP",
    code: `<?php
class Calculator {
    public function add($a, $b) {
        return $a + $b;
    }

    public function multiply($a, $b) {
        return $a * $b;
    }
}
?>`,
    description: "Simple class",
    tier: "baseline",
  },
  {
    id: "php_long",
    language: "PHP",
    code: `<?php
namespace App\\Controllers;

class UserController extends Controller {
    private UserRepository $repository;

    public function __construct(UserRepository $repository) {
        $this->repository = $repository;
    }

    public function index(): JsonResponse {
        $users = $this->repository->findAll();
        return response()->json($users);
    }
}
?>`,
    description: "Laravel-style controller",
    tier: "baseline",
  },
  {
    id: "php_trait",
    language: "PHP",
    code: `<?php
trait Timestampable {
    public DateTime $createdAt;
    public DateTime $updatedAt;

    public function touch(): void {
        $this->updatedAt = new DateTime();
    }
}

class Entity {
    use Timestampable;
}
?>`,
    description: "Trait usage",
    tier: "baseline",
  },
  {
    id: "php_attribute",
    language: "PHP",
    code: `<?php
#[Route("/api/users", methods: ["GET"])]
#[Cache(maxage: 3600)]
class UserController {
    #[Required]
    private LoggerInterface $logger;

    #[Route("/{id}", methods: ["GET"])]
    public function show(#[MapEntity] User $user): Response {
        return new JsonResponse($user);
    }
}
?>`,
    description: "PHP 8 attributes",
    tier: "baseline",
  },
  {
    id: "php_match",
    language: "PHP",
    code: `<?php
$result = match($status) {
    200, 201 => "success",
    400 => "bad request",
    404 => "not found",
    500 => throw new ServerException(),
    default => "unknown"
};

$value = $nullable?->property?->method();
$array = [...$first, ...$second];
?>`,
    description: "Match expression and nullsafe",
    tier: "baseline",
  },

  // ============================================================
  // SHELL - Baseline
  // ============================================================
  {
    id: "shell_short",
    language: "Shell",
    code: `#!/bin/bash
echo "Hello, World!"`,
    description: "Hello World",
    tier: "baseline",
  },
  {
    id: "shell_medium",
    language: "Shell",
    code: `#!/bin/bash
for file in *.txt; do
    if [ -f "$file" ]; then
        echo "Processing $file"
        wc -l "$file"
    fi
done`,
    description: "File processing loop",
    tier: "baseline",
  },
  {
    id: "shell_long",
    language: "Shell",
    code: `#!/bin/bash
set -euo pipefail

readonly LOG_FILE="/var/log/backup.log"

log() {
    echo "[$(date +"%Y-%m-%d %H:%M:%S")] $1" | tee -a "$LOG_FILE"
}

backup_database() {
    local db_name="$1"
    local backup_dir="\${2:-/backups}"

    if ! command -v pg_dump &> /dev/null; then
        log "ERROR: pg_dump not found"
        return 1
    fi

    pg_dump "$db_name" | gzip > "\${backup_dir}/\${db_name}_$(date +%Y%m%d).sql.gz"
    log "Backup completed for $db_name"
}`,
    description: "Backup script with functions",
    tier: "baseline",
  },
  {
    id: "shell_trap",
    language: "Shell",
    code: `#!/bin/bash
cleanup() {
    echo "Cleaning up..."
    rm -f "$TEMP_FILE"
    exit
}

trap cleanup EXIT INT TERM

TEMP_FILE=$(mktemp)
trap "rm -f $TEMP_FILE" EXIT`,
    description: "Signal trapping",
    tier: "baseline",
  },
  {
    id: "shell_array",
    language: "Shell",
    code: `#!/bin/bash
declare -A config
config[host]="localhost"
config[port]=8080
config[debug]=true

fruits=("apple" "banana" "cherry")
for fruit in "\${fruits[@]}"; do
    echo "$fruit"
done

echo "Host: \${config[host]}"`,
    description: "Arrays and associative arrays",
    tier: "baseline",
  },
  {
    id: "shell_heredoc",
    language: "Shell",
    code: `#!/bin/bash
cat <<EOF > config.json
{
    "name": "$PROJECT_NAME",
    "version": "$VERSION",
    "enabled": true
}
EOF

read -r -d '' sql_query <<-EOSQL
    SELECT *
    FROM users
    WHERE active = true;
EOSQL`,
    description: "Heredoc syntax",
    tier: "baseline",
  },

  // ============================================================
  // SQL - Baseline
  // ============================================================
  {
    id: "sql_short",
    language: "SQL",
    code: `SELECT * FROM users;`,
    description: "Simple select",
    tier: "baseline",
  },
  {
    id: "sql_medium",
    language: "SQL",
    code: `SELECT u.name, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.active = true
GROUP BY u.id, u.name
HAVING COUNT(o.id) > 5
ORDER BY order_count DESC;`,
    description: "Join with aggregation",
    tier: "baseline",
  },
  {
    id: "sql_long",
    language: "SQL",
    code: `WITH monthly_sales AS (
    SELECT
        DATE_TRUNC('month', order_date) as month,
        SUM(total_amount) as revenue,
        COUNT(DISTINCT customer_id) as unique_customers
    FROM orders
    WHERE order_date >= NOW() - INTERVAL '12 months'
    GROUP BY DATE_TRUNC('month', order_date)
),
growth AS (
    SELECT
        month,
        revenue,
        LAG(revenue) OVER (ORDER BY month) as prev_revenue,
        (revenue - LAG(revenue) OVER (ORDER BY month)) /
            NULLIF(LAG(revenue) OVER (ORDER BY month), 0) * 100 as growth_rate
    FROM monthly_sales
)
SELECT * FROM growth WHERE growth_rate IS NOT NULL;`,
    description: "CTE with window functions",
    tier: "baseline",
  },
  {
    id: "sql_recursive_cte",
    language: "SQL",
    code: `WITH RECURSIVE hierarchy AS (
    SELECT id, name, parent_id, 1 as level
    FROM categories
    WHERE parent_id IS NULL
    UNION ALL
    SELECT c.id, c.name, c.parent_id, h.level + 1
    FROM categories c
    JOIN hierarchy h ON c.parent_id = h.id
)
SELECT * FROM hierarchy ORDER BY level, name;`,
    description: "Recursive CTE for hierarchy",
    tier: "baseline",
  },
  {
    id: "sql_pivot",
    language: "SQL",
    code: `SELECT *
FROM (
    SELECT product, year, revenue
    FROM sales
) AS source
PIVOT (
    SUM(revenue)
    FOR year IN ([2022], [2023], [2024])
) AS pivot_table;`,
    description: "Pivot table",
    tier: "baseline",
  },
  {
    id: "sql_merge",
    language: "SQL",
    code: `MERGE INTO target_table t
USING source_table s
ON t.id = s.id
WHEN MATCHED AND s.deleted = true THEN
    DELETE
WHEN MATCHED THEN
    UPDATE SET t.value = s.value, t.updated_at = NOW()
WHEN NOT MATCHED THEN
    INSERT (id, value, created_at)
    VALUES (s.id, s.value, NOW());`,
    description: "MERGE statement",
    tier: "baseline",
  },

  // ============================================================
  // HTML - Baseline
  // ============================================================
  {
    id: "html_short",
    language: "HTML",
    code: `<!DOCTYPE html>
<html>
<head><title>Hello</title></head>
<body><h1>Hello, World!</h1></body>
</html>`,
    description: "Minimal HTML document",
    tier: "baseline",
  },
  {
    id: "html_medium",
    language: "HTML",
    code: `<form action="/submit" method="POST">
    <label for="name">Name:</label>
    <input type="text" id="name" name="name" required>
    <label for="email">Email:</label>
    <input type="email" id="email" name="email" required>
    <button type="submit">Submit</button>
</form>`,
    description: "Form with inputs",
    tier: "baseline",
  },
  {
    id: "html_long",
    language: "HTML",
    code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <nav class="navbar">
        <ul class="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
        </ul>
    </nav>
    <main id="app" data-controller="application"></main>
    <script type="module" src="app.js"></script>
</body>
</html>`,
    description: "Full page structure",
    tier: "baseline",
  },
  {
    id: "html_template",
    language: "HTML",
    code: `<template id="card-template">
    <article class="card">
        <slot name="header"></slot>
        <div class="content">
            <slot></slot>
        </div>
    </article>
</template>

<card-component>
    <h2 slot="header">Title</h2>
    <p>Content goes here</p>
</card-component>`,
    description: "Web component template",
    tier: "baseline",
  },
  {
    id: "html_dialog",
    language: "HTML",
    code: `<dialog id="confirm-dialog">
    <form method="dialog">
        <h2>Confirm Action</h2>
        <p>Are you sure you want to proceed?</p>
        <menu>
            <button value="cancel">Cancel</button>
            <button value="confirm">Confirm</button>
        </menu>
    </form>
</dialog>

<button onclick="document.getElementById('confirm-dialog').showModal()">
    Open Dialog
</button>`,
    description: "Dialog element",
    tier: "baseline",
  },
  {
    id: "html_details",
    language: "HTML",
    code: `<details open>
    <summary>Click to expand</summary>
    <div class="details-content">
        <p>This content is collapsible.</p>
        <details>
            <summary>Nested details</summary>
            <p>More information here.</p>
        </details>
    </div>
</details>`,
    description: "Details/summary element",
    tier: "baseline",
  },

  // ============================================================
  // CSS - Baseline
  // ============================================================
  {
    id: "css_short",
    language: "CSS",
    code: `body {
    background-color: white;
    color: black;
}`,
    description: "Basic styling",
    tier: "baseline",
  },
  {
    id: "css_medium",
    language: "CSS",
    code: `.container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
}

.card {
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}`,
    description: "Flexbox layout",
    tier: "baseline",
  },
  {
    id: "css_long",
    language: "CSS",
    code: `:root {
    --primary-color: #3498db;
    --spacing-unit: 8px;
}

@media (prefers-color-scheme: dark) {
    :root {
        --bg-color: #1a1a1a;
        --text-color: #ffffff;
    }
}

.grid-layout {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: calc(var(--spacing-unit) * 2);
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
}`,
    description: "Custom properties and grid",
    tier: "baseline",
  },
  {
    id: "css_container",
    language: "CSS",
    code: `@container (min-width: 400px) {
    .card {
        display: grid;
        grid-template-columns: 1fr 2fr;
    }
}

.sidebar {
    container-type: inline-size;
    container-name: sidebar;
}`,
    description: "Container queries",
    tier: "baseline",
  },
  {
    id: "css_has",
    language: "CSS",
    code: `a:has(> img) {
    display: block;
}

.form-group:has(input:invalid) {
    border-color: red;
}

h2:has(+ p) {
    margin-bottom: 0.5rem;
}

li:not(:has(ul)) {
    list-style: disc;
}`,
    description: ":has() pseudo-class",
    tier: "baseline",
  },
  {
    id: "css_layer",
    language: "CSS",
    code: `@layer base, components, utilities;

@layer base {
    * { box-sizing: border-box; }
    body { font-family: system-ui; }
}

@layer components {
    .button {
        padding: 0.5rem 1rem;
        border-radius: 4px;
    }
}

@layer utilities {
    .hidden { display: none !important; }
}`,
    description: "Cascade layers",
    tier: "baseline",
  },

  // ============================================================
  // ASSEMBLY - Baseline
  // ============================================================
  {
    id: "asm_short",
    language: "Assembly",
    code: `section .data
    msg db "Hello, World!", 10
section .text
    global _start
_start:
    mov eax, 4
    mov ebx, 1
    mov ecx, msg
    mov edx, 14
    int 0x80`,
    description: "Hello World syscall",
    tier: "baseline",
  },
  {
    id: "asm_medium",
    language: "Assembly",
    code: `section .data
    msg db "Sum: ", 0
    newline db 10
section .bss
    buffer resb 16
section .text
    global _start

_start:
    xor eax, eax
    xor ebx, ebx
    mov ecx, 10
.loop:
    add eax, ecx
    dec ecx
    jnz .loop
    mov [buffer], eax
    mov eax, 4
    mov ebx, 1
    mov ecx, msg
    mov edx, 5
    int 0x80
    mov eax, 1
    xor ebx, ebx
    int 0x80`,
    description: "Sum loop with syscalls",
    tier: "baseline",
  },
  {
    id: "asm_long",
    language: "Assembly",
    code: `section .bss
    buffer resb 256
section .text
    global _start
_start:
    ; Read from stdin
    mov eax, 3          ; sys_read
    mov ebx, 0          ; stdin
    mov ecx, buffer
    mov edx, 256
    int 0x80
    ; Write to stdout
    mov edx, eax        ; bytes read
    mov eax, 4          ; sys_write
    mov ebx, 1          ; stdout
    mov ecx, buffer
    int 0x80
    ; Exit
    mov eax, 1          ; sys_exit
    xor ebx, ebx
    int 0x80`,
    description: "Echo program",
    tier: "baseline",
  },

  // ============================================================
  // BATCHFILE - Baseline
  // ============================================================
  {
    id: "bat_short",
    language: "Batchfile",
    code: `@echo off
echo Hello, World!
pause`,
    description: "Hello World",
    tier: "baseline",
  },
  {
    id: "bat_medium",
    language: "Batchfile",
    code: `@echo off
setlocal
set /a count=0
set "message=Processing"
:loop
if %count% geq 10 goto end
echo %message%: %count%
set /a count+=1
goto loop
:end
echo Done!
endlocal
pause`,
    description: "Loop with counter",
    tier: "baseline",
  },
  {
    id: "bat_long",
    language: "Batchfile",
    code: `@echo off
setlocal enabledelayedexpansion
set "source=%~1"
set "dest=%~2"
set "count=0"
if "%source%"=="" (
    echo Usage: %~nx0 source destination
    exit /b 1
)
if not exist "%source%" (
    echo Error: Source directory does not exist
    exit /b 1
)
for %%f in ("%source%\\*.*") do (
    set "filename=%%~nxf"
    set /a count+=1
    echo [!count!] Copying !filename!...
    copy "%%f" "%dest%\\!filename!" >nul
)
echo Backup complete. %count% files copied.
endlocal
pause`,
    description: "File backup script",
    tier: "baseline",
  },

  // ============================================================
  // CMAKE - Baseline
  // ============================================================
  {
    id: "cmake_short",
    language: "CMake",
    code: `cmake_minimum_required(VERSION 3.10)
project(HelloWorld)
add_executable(hello main.cpp)`,
    description: "Minimal CMakeLists",
    tier: "baseline",
  },
  {
    id: "cmake_medium",
    language: "CMake",
    code: `cmake_minimum_required(VERSION 3.14)
project(MyProject VERSION 1.0)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(Boost REQUIRED COMPONENTS filesystem)

add_executable(myapp src/main.cpp src/utils.cpp)
target_link_libraries(myapp PRIVATE Boost::filesystem)`,
    description: "Project with dependencies",
    tier: "baseline",
  },
  {
    id: "cmake_long",
    language: "CMake",
    code: `cmake_minimum_required(VERSION 3.16)
project(MyProject VERSION 2.0)

option(BUILD_TESTS "Build test executables" ON)
option(BUILD_DOCS "Build documentation" OFF)

set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

include(GNUInstallDirs)
include(CMakePackageConfigHelpers)

find_package(PkgConfig REQUIRED)
pkg_check_modules(DEPS REQUIRED libcurl openssl)

message(STATUS "Project version: \${PROJECT_VERSION}")
message(STATUS "Install prefix: \${CMAKE_INSTALL_PREFIX}")

configure_file(
    \${CMAKE_CURRENT_SOURCE_DIR}/config.h.in
    \${CMAKE_CURRENT_BINARY_DIR}/config.h
)

add_library(mylib SHARED)
set_target_properties(mylib PROPERTIES
    VERSION \${PROJECT_VERSION}
    SOVERSION \${PROJECT_VERSION_MAJOR}
)

if(BUILD_DOCS)
    find_package(Doxygen REQUIRED)
    doxygen_add_docs(docs \${CMAKE_CURRENT_SOURCE_DIR})
endif()

install(TARGETS mylib
    LIBRARY DESTINATION \${CMAKE_INSTALL_LIBDIR}
    ARCHIVE DESTINATION \${CMAKE_INSTALL_LIBDIR}
)`,
    description: "Full project configuration",
    tier: "baseline",
  },

  // ============================================================
  // DOCKERFILE - Baseline
  // ============================================================
  {
    id: "docker_short",
    language: "Dockerfile",
    code: `FROM python:3.11-slim
WORKDIR /app
COPY . .
RUN pip install -r requirements.txt
CMD ["python", "app.py"]`,
    description: "Simple Python image",
    tier: "baseline",
  },
  {
    id: "docker_medium",
    language: "Dockerfile",
    code: `FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`,
    description: "Multi-stage build",
    tier: "baseline",
  },
  {
    id: "docker_long",
    language: "Dockerfile",
    code: `FROM python:3.11-slim AS base
ENV PYTHONDONTWRITEBYTECODE=1 \\
    PYTHONUNBUFFERED=1 \\
    PIP_NO_CACHE_DIR=1

FROM base AS builder
RUN apt-get update && apt-get install -y --no-install-recommends \\
    build-essential \\
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY requirements.txt .
RUN pip wheel --wheel-dir=/wheels -r requirements.txt

FROM base AS runtime
COPY --from=builder /wheels /wheels
RUN pip install --no-index --find-links=/wheels /wheels/*
WORKDIR /app
COPY src/ ./src/
RUN useradd --create-home appuser && chown -R appuser:appuser /app
USER appuser
HEALTHCHECK --interval=30s CMD curl -f http://localhost:8000/health || exit 1
ENTRYPOINT ["python", "-m", "src.main"]`,
    description: "Production-ready Dockerfile",
    tier: "baseline",
  },

  // ============================================================
  // FORTRAN - Baseline
  // ============================================================
  {
    id: "fortran_short",
    language: "FORTRAN",
    code: `program hello
    print *, "Hello, World!"
end program hello`,
    description: "Hello World",
    tier: "baseline",
  },
  {
    id: "fortran_medium",
    language: "FORTRAN",
    code: `program factorial
    implicit none
    integer :: n, result
    n = 5
    result = fact(n)
    print *, "Factorial of", n, "is", result
contains
    recursive function fact(n) result(f)
        integer, intent(in) :: n
        integer :: f
        if (n <= 1) then
            f = 1
        else
            f = n * fact(n - 1)
        end if
    end function fact
end program factorial`,
    description: "Recursive function",
    tier: "baseline",
  },
  {
    id: "fortran_long",
    language: "FORTRAN",
    code: `module matrix_ops
    implicit none
    private
    public :: matrix_multiply, matrix_transpose

contains
    subroutine matrix_multiply(A, B, C, m, n, p)
        integer, intent(in) :: m, n, p
        real(8), intent(in) :: A(m, n), B(n, p)
        real(8), intent(out) :: C(m, p)
        integer :: i, j, k
        C = 0.0d0
        do j = 1, p
            do k = 1, n
                do i = 1, m
                    C(i, j) = C(i, j) + A(i, k) * B(k, j)
                end do
            end do
        end do
    end subroutine matrix_multiply

    subroutine matrix_transpose(A, AT, m, n)
        integer, intent(in) :: m, n
        real(8), intent(in) :: A(m, n)
        real(8), intent(out) :: AT(n, m)
        AT = transpose(A)
    end subroutine matrix_transpose
end module matrix_ops`,
    description: "Matrix operations module",
    tier: "baseline",
  },

  // ============================================================
  // HASKELL - Baseline
  // ============================================================
  {
    id: "haskell_short",
    language: "Haskell",
    code: `module Main where

import Data.List (sort)

main :: IO ()
main = do
    putStrLn "Hello, World!"
    print $ sort [3, 1, 2]`,
    description: "Hello World with imports",
    tier: "baseline",
  },
  {
    id: "haskell_medium",
    language: "Haskell",
    code: `fibonacci :: Int -> Int
fibonacci 0 = 0
fibonacci 1 = 1
fibonacci n = fibonacci (n - 1) + fibonacci (n - 2)

main :: IO ()
main = print $ map fibonacci [0..10]`,
    description: "Pattern matching fibonacci",
    tier: "baseline",
  },
  {
    id: "haskell_long",
    language: "Haskell",
    code: `module Main where

import Control.Monad (forM_)
import Data.List (sortBy)
import Data.Ord (comparing)

data Person = Person
    { name :: String
    , age :: Int
    } deriving (Show, Eq)

instance Ord Person where
    compare = comparing age

sortPeople :: [Person] -> [Person]
sortPeople = sortBy (comparing name)

main :: IO ()
main = do
    let people = [Person "Alice" 30, Person "Bob" 25, Person "Charlie" 35]
    putStrLn "Sorted by name:"
    forM_ (sortPeople people) print`,
    description: "Data types and instances",
    tier: "baseline",
  },

  // ============================================================
  // JULIA - Baseline
  // ============================================================
  {
    id: "julia_short",
    language: "Julia",
    code: `println("Hello, World!")`,
    description: "Hello World",
    tier: "baseline",
  },
  {
    id: "julia_medium",
    language: "Julia",
    code: `function fibonacci(n::Int)
    if n <= 1
        return n
    end
    return fibonacci(n - 1) + fibonacci(n - 2)
end

for i in 0:10
    println("fib($i) = $(fibonacci(i))")
end`,
    description: "Type-annotated function",
    tier: "baseline",
  },
  {
    id: "julia_long",
    language: "Julia",
    code: `module Statistics

export mean, std, normalize

function mean(x::AbstractVector{T}) where T <: Number
    return sum(x) / length(x)
end

function std(x::AbstractVector{T}) where T <: Number
    m = mean(x)
    return sqrt(sum((xi - m)^2 for xi in x) / (length(x) - 1))
end

function normalize(x::AbstractVector{T}) where T <: Number
    m, s = mean(x), std(x)
    return [(xi - m) / s for xi in x]
end

end # module

using .Statistics
data = [1.0, 2.0, 3.0, 4.0, 5.0]
println("Mean: $(mean(data))")
println("Std: $(std(data))")
println("Normalized: $(normalize(data))")`,
    description: "Module with parametric types",
    tier: "baseline",
  },

  // ============================================================
  // LUA - Baseline
  // ============================================================
  {
    id: "lua_short",
    language: "Lua",
    code: `local greeting = "Hello"
local name = "World"
print(greeting .. ", " .. name .. "!")`,
    description: "String concatenation",
    tier: "baseline",
  },
  {
    id: "lua_medium",
    language: "Lua",
    code: `function factorial(n)
    if n <= 1 then
        return 1
    end
    return n * factorial(n - 1)
end

for i = 1, 10 do
    print(string.format("factorial(%d) = %d", i, factorial(i)))
end`,
    description: "Factorial with loop",
    tier: "baseline",
  },
  {
    id: "lua_long",
    language: "Lua",
    code: `local Vector = {}
Vector.__index = Vector

function Vector.new(x, y)
    local self = setmetatable({}, Vector)
    self.x = x or 0
    self.y = y or 0
    return self
end

function Vector:__add(other)
    return Vector.new(self.x + other.x, self.y + other.y)
end

function Vector:__tostring()
    return string.format("Vector(%g, %g)", self.x, self.y)
end

function Vector:magnitude()
    return math.sqrt(self.x^2 + self.y^2)
end

local v1 = Vector.new(3, 4)
local v2 = Vector.new(1, 2)
local v3 = v1 + v2
print(v3)
print("Magnitude: " .. v1:magnitude())`,
    description: "Metatable-based OOP",
    tier: "baseline",
  },

  // ============================================================
  // MAKEFILE - Baseline
  // ============================================================
  {
    id: "makefile_short",
    language: "Makefile",
    code: `CC = gcc
CFLAGS = -Wall -g

all: main

main: main.o
\t$(CC) $(CFLAGS) -o main main.o

clean:
\trm -f *.o main`,
    description: "Simple C Makefile",
    tier: "baseline",
  },
  {
    id: "makefile_medium",
    language: "Makefile",
    code: `CC = gcc
CFLAGS = -Wall -Wextra -O2
LDFLAGS = -lm

SRCDIR = src
OBJDIR = obj
BINDIR = bin

SOURCES = $(wildcard $(SRCDIR)/*.c)
OBJECTS = $(patsubst $(SRCDIR)/%.c,$(OBJDIR)/%.o,$(SOURCES))
TARGET = $(BINDIR)/program

.PHONY: all clean

all: $(TARGET)

$(TARGET): $(OBJECTS) | $(BINDIR)
\t$(CC) $(OBJECTS) -o $@ $(LDFLAGS)

$(OBJDIR)/%.o: $(SRCDIR)/%.c | $(OBJDIR)
\t$(CC) $(CFLAGS) -c $< -o $@

$(BINDIR) $(OBJDIR):
\tmkdir -p $@

clean:
\trm -rf $(OBJDIR) $(BINDIR)`,
    description: "Project with directories",
    tier: "baseline",
  },
  {
    id: "makefile_long",
    language: "Makefile",
    code: `.PHONY: all build test lint format clean install docker-build docker-run

PROJECT_NAME := myproject
VERSION := $(shell git describe --tags --always --dirty)
BUILD_TIME := $(shell date -u +"%Y-%m-%dT%H:%M:%SZ")
GOFLAGS := -ldflags "-X main.Version=$(VERSION) -X main.BuildTime=$(BUILD_TIME)"

DOCKER_IMAGE := $(PROJECT_NAME):$(VERSION)

all: lint test build

build:
\t@echo "Building $(PROJECT_NAME) $(VERSION)..."
\tgo build $(GOFLAGS) -o bin/$(PROJECT_NAME) ./cmd/...

test:
\tgo test -v -race -coverprofile=coverage.out ./...
\tgo tool cover -html=coverage.out -o coverage.html

lint:
\tgolangci-lint run ./...

format:
\tgofmt -s -w .
\tgoimports -w .

clean:
\trm -rf bin/ coverage.out coverage.html

install: build
\tcp bin/$(PROJECT_NAME) /usr/local/bin/

docker-build:
\tdocker build -t $(DOCKER_IMAGE) .

docker-run:
\tdocker run --rm -it $(DOCKER_IMAGE)`,
    description: "Go project Makefile",
    tier: "baseline",
  },

  // ============================================================
  // MARKDOWN - Baseline
  // ============================================================
  {
    id: "md_short",
    language: "Markdown",
    code: `# Hello World

This is a simple markdown document.`,
    description: "Simple document",
    tier: "baseline",
  },
  {
    id: "md_medium",
    language: "Markdown",
    code: `# Project Documentation

## Installation

Run the following command:

\`\`\`bash
npm install my-package
\`\`\`

## Usage

- Import the module
- Call the function
- Handle the result

See [the docs](https://example.com) for more info.`,
    description: "Documentation with code block",
    tier: "baseline",
  },
  {
    id: "md_long",
    language: "Markdown",
    code: `# API Reference

## Table of Contents

1. [Introduction](#introduction)
2. [Authentication](#authentication)
3. [Endpoints](#endpoints)

## Introduction

This API provides access to user management features.

## Authentication

| Header | Description |
|--------|-------------|
| Authorization | Bearer token |
| X-API-Key | API key for rate limiting |

## Endpoints

### GET /users

Returns a list of users.

**Response:**

\`\`\`json
{
  "users": [
    {"id": 1, "name": "Alice"},
    {"id": 2, "name": "Bob"}
  ]
}
\`\`\`

> **Note:** Rate limited to 100 requests per minute.

---

*Last updated: 2024-01-15*`,
    description: "API documentation",
    tier: "baseline",
  },

  // ============================================================
  // PERL - Baseline
  // ============================================================
  {
    id: "perl_short",
    language: "Perl",
    code: `#!/usr/bin/perl
use strict;
use warnings;
print "Hello, World!\\n";`,
    description: "Hello World",
    tier: "baseline",
  },
  {
    id: "perl_medium",
    language: "Perl",
    code: `#!/usr/bin/perl
use strict;
use warnings;

my %word_count;
while (my $line = <DATA>) {
    chomp $line;
    for my $word (split /\\s+/, $line) {
        $word_count{lc $word}++;
    }
}

for my $word (sort keys %word_count) {
    print "$word: $word_count{$word}\\n";
}

__DATA__
The quick brown fox jumps over the lazy dog
The dog barks at the fox`,
    description: "Word counter with DATA",
    tier: "baseline",
  },
  {
    id: "perl_long",
    language: "Perl",
    code: `#!/usr/bin/perl
use strict;
use warnings;
use File::Find;
use Digest::MD5 qw(md5_hex);

my %file_hashes;

sub process_file {
    return unless -f $_;
    open my $fh, "<:raw", $_ or return;
    local $/;
    my $content = <$fh>;
    close $fh;

    my $hash = md5_hex($content);
    push @{$file_hashes{$hash}}, $File::Find::name;
}

my $dir = $ARGV[0] // ".";
find(\\&process_file, $dir);

print "Duplicate files:\\n";
for my $hash (keys %file_hashes) {
    my @files = @{$file_hashes{$hash}};
    if (@files > 1) {
        print "Hash: $hash\\n";
        print "  $_\\n" for @files;
    }
}`,
    description: "Duplicate file finder",
    tier: "baseline",
  },

  // ============================================================
  // POWERSHELL - Baseline
  // ============================================================
  {
    id: "ps_short",
    language: "PowerShell",
    code: `Write-Host "Hello, World!"
$name = "PowerShell"
Write-Host "Welcome to $name"
Get-ChildItem -Path . | Where-Object { $_.Length -gt 0 }
$PSVersionTable.PSVersion`,
    description: "Basic cmdlets",
    tier: "baseline",
  },
  {
    id: "ps_medium",
    language: "PowerShell",
    code: `function Get-DiskUsage {
    param(
        [string]$Path = "C:\\"
    )
    Get-ChildItem -Path $Path -Recurse -File -ErrorAction SilentlyContinue |
        Measure-Object -Property Length -Sum |
        Select-Object @{N="Path";E={$Path}}, @{N="SizeGB";E={[math]::Round($_.Sum/1GB,2)}}
}

Get-DiskUsage -Path "C:\\Users" | Format-Table -AutoSize`,
    description: "Function with parameters",
    tier: "baseline",
  },
  {
    id: "ps_long",
    language: "PowerShell",
    code: `#Requires -Version 5.1

[CmdletBinding()]
param(
    [Parameter(Mandatory)]
    [string]$ComputerName,

    [ValidateSet("Full", "Quick")]
    [string]$ScanType = "Quick"
)

function Test-RemoteConnection {
    param([string]$Computer)
    try {
        $result = Test-Connection -ComputerName $Computer -Count 1 -Quiet
        return $result
    }
    catch {
        Write-Error "Failed to connect to $Computer: $_"
        return $false
    }
}

function Get-SystemInfo {
    param([string]$Computer)

    $info = @{}
    $info.OS = (Get-CimInstance -ComputerName $Computer -ClassName Win32_OperatingSystem).Caption
    $info.CPU = (Get-CimInstance -ComputerName $Computer -ClassName Win32_Processor).Name
    $info.RAM = [math]::Round((Get-CimInstance -ComputerName $Computer -ClassName Win32_ComputerSystem).TotalPhysicalMemory / 1GB, 2)

    return [PSCustomObject]$info
}

if (Test-RemoteConnection -Computer $ComputerName) {
    Get-SystemInfo -Computer $ComputerName | Format-List
}`,
    description: "System info script",
    tier: "baseline",
  },

  // ============================================================
  // SCALA - Baseline
  // ============================================================
  {
    id: "scala_short",
    language: "Scala",
    code: `object HelloWorld extends App {
  println("Hello, World!")
}`,
    description: "Hello World App",
    tier: "baseline",
  },
  {
    id: "scala_medium",
    language: "Scala",
    code: `case class Person(name: String, age: Int)

object PersonApp extends App {
  val people = List(
    Person("Alice", 30),
    Person("Bob", 25),
    Person("Charlie", 35)
  )

  val adults = people.filter(_.age >= 30)
  val names = adults.map(_.name)

  println(s"Adults: \${names.mkString(", ")}")
}`,
    description: "Case class with collections",
    tier: "baseline",
  },
  {
    id: "scala_long",
    language: "Scala",
    code: `import scala.concurrent.{Future, ExecutionContext}
import scala.util.{Success, Failure}

implicit val ec: ExecutionContext = ExecutionContext.global

trait Repository[T] {
  def findById(id: Long): Future[Option[T]]
  def save(entity: T): Future[T]
  def delete(id: Long): Future[Boolean]
}

case class User(id: Long, name: String, email: String)

class UserRepository extends Repository[User] {
  private var users = Map.empty[Long, User]

  override def findById(id: Long): Future[Option[User]] =
    Future.successful(users.get(id))

  override def save(entity: User): Future[User] = Future {
    users = users + (entity.id -> entity)
    entity
  }

  override def delete(id: Long): Future[Boolean] = Future {
    val exists = users.contains(id)
    users = users - id
    exists
  }
}

object Main extends App {
  val repo = new UserRepository
  repo.save(User(1, "Alice", "alice@example.com")).onComplete {
    case Success(user) => println(s"Saved: $user")
    case Failure(ex) => println(s"Error: \${ex.getMessage}")
  }
}`,
    description: "Repository pattern with Futures",
    tier: "baseline",
  },

  // ============================================================
  // TEX - Baseline
  // ============================================================
  {
    id: "tex_short",
    language: "TeX",
    code: `\\documentclass{article}
\\begin{document}
Hello, World!
\\end{document}`,
    description: "Minimal document",
    tier: "baseline",
  },
  {
    id: "tex_medium",
    language: "TeX",
    code: `\\documentclass{article}
\\usepackage{amsmath}
\\usepackage{graphicx}

\\title{Sample Document}
\\author{Author Name}
\\date{\\today}

\\begin{document}
\\maketitle

\\section{Introduction}
This is a sample document with math:
\\begin{equation}
    E = mc^2
\\end{equation}

\\section{Conclusion}
The quadratic formula is $x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$.
\\end{document}`,
    description: "Document with math",
    tier: "baseline",
  },
  {
    id: "tex_long",
    language: "TeX",
    code: `\\documentclass[12pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{amsmath,amssymb,amsthm}
\\usepackage{graphicx}
\\usepackage{hyperref}

\\title{Mathematical Analysis}
\\author{John Smith}
\\date{\\today}

\\newcommand{\\R}{\\mathbb{R}}
\\newcommand{\\N}{\\mathbb{N}}

\\begin{document}
\\maketitle

\\begin{abstract}
This document demonstrates LaTeX formatting with mathematical equations.
\\end{abstract}

\\tableofcontents

\\section{Introduction}
\\label{sec:intro}

The quadratic formula is given by:
\\begin{equation}
    x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
    \\label{eq:quadratic}
\\end{equation}

\\section{Examples}
\\begin{enumerate}
    \\item First example with $\\alpha$ and $\\beta$
    \\item Second example with $\\gamma$
\\end{enumerate}

See Section~\\ref{sec:intro} and Equation~\\ref{eq:quadratic}.

\\bibliographystyle{plain}
\\bibliography{refs}

\\end{document}`,
    description: "Full academic document",
    tier: "baseline",
  },

  // ============================================================
  // VISUAL BASIC - Baseline
  // ============================================================
  {
    id: "vb_short",
    language: "Visual Basic",
    code: `Module HelloWorld
    Sub Main()
        Console.WriteLine("Hello, World!")
    End Sub
End Module`,
    description: "Hello World",
    tier: "baseline",
  },
  {
    id: "vb_medium",
    language: "Visual Basic",
    code: `Public Class Calculator
    Public Function Add(a As Integer, b As Integer) As Integer
        Return a + b
    End Function

    Public Function Multiply(a As Integer, b As Integer) As Integer
        Return a * b
    End Function

    Public Function Factorial(n As Integer) As Integer
        If n <= 1 Then Return 1
        Return n * Factorial(n - 1)
    End Function
End Class`,
    description: "Calculator class",
    tier: "baseline",
  },
  {
    id: "vb_long",
    language: "Visual Basic",
    code: `Imports System.Data.SqlClient

Public Class UserRepository
    Private ReadOnly _connectionString As String

    Public Sub New(connectionString As String)
        _connectionString = connectionString
    End Sub

    Public Function GetUserById(id As Integer) As User
        Using connection As New SqlConnection(_connectionString)
            connection.Open()
            Using command As New SqlCommand("SELECT * FROM Users WHERE Id = @Id", connection)
                command.Parameters.AddWithValue("@Id", id)
                Using reader As SqlDataReader = command.ExecuteReader()
                    If reader.Read() Then
                        Return New User With {
                            .Id = reader.GetInt32(0),
                            .Name = reader.GetString(1),
                            .Email = reader.GetString(2)
                        }
                    End If
                End Using
            End Using
        End Using
        Return Nothing
    End Function

    Public Sub SaveUser(user As User)
        Using connection As New SqlConnection(_connectionString)
            connection.Open()
            Using command As New SqlCommand("INSERT INTO Users (Name, Email) VALUES (@Name, @Email)", connection)
                command.Parameters.AddWithValue("@Name", user.Name)
                command.Parameters.AddWithValue("@Email", user.Email)
                command.ExecuteNonQuery()
            End Using
        End Using
    End Sub
End Class`,
    description: "Database repository",
    tier: "baseline",
  },

  // ============================================================
  // HARD TESTS - Minimal distinctive features
  // ============================================================
  {
    id: "py_hard_comprehension",
    language: "Python",
    code: `squares = [x**2 for x in range(10)]`,
    description: "List comprehension only",
    tier: "hard",
  },
  {
    id: "py_hard_minimal",
    language: "Python",
    code: `x = 5
y = x + 3`,
    description: "Minimal assignment",
    tier: "hard",
  },
  {
    id: "js_hard_no_console",
    language: "JavaScript",
    code: `const add = (a, b) => a + b;
const result = add(2, 3);`,
    description: "Pure function without console",
    tier: "hard",
  },
  {
    id: "ts_hard_minimal_types",
    language: "TypeScript",
    code: `const greet = (name: string) => \`Hello, \${name}\`;
const message = greet("World");`,
    description: "Minimal type annotation",
    tier: "hard",
  },
  {
    id: "c_hard_no_include",
    language: "C",
    code: `int factorial(int n) {
    return n <= 1 ? 1 : n * factorial(n-1);
}`,
    description: "Function without includes",
    tier: "hard",
  },
  {
    id: "cpp_hard_lambda_only",
    language: "C++",
    code: `auto sum = [](int a, int b) { return a + b; };
auto result = sum(3, 4);`,
    description: "Lambda without templates",
    tier: "hard",
  },
  {
    id: "java_hard_lambda_only",
    language: "Java",
    code: `Comparator<Integer> cmp = (a, b) -> a - b;
BiFunction<Integer, Integer, Integer> add = (a, b) -> a + b;`,
    description: "Lambdas without class wrapper",
    tier: "hard",
  },
  {
    id: "go_hard_no_package",
    language: "GO",
    code: `func sum(nums []int) int {
    total := 0
    for _, n := range nums {
        total += n
    }
    return total
}`,
    description: "Function without package",
    tier: "hard",
  },
  {
    id: "rust_hard_simple",
    language: "Rust",
    code: `fn add(a: i32, b: i32) -> i32 {
    a + b
}`,
    description: "Simple function without lifetimes",
    tier: "hard",
  },
  {
    id: "ruby_hard_oneliner",
    language: "Ruby",
    code: `result = [1, 2, 3].map { |n| n * 2 }.sum`,
    description: "One-liner without end",
    tier: "hard",
  },
  {
    id: "shell_hard_no_shebang",
    language: "Shell",
    code: `for f in *.txt; do
    wc -l "$f"
done`,
    description: "Loop without shebang",
    tier: "hard",
  },
  {
    id: "sql_hard_minimal",
    language: "SQL",
    code: `SELECT 1`,
    description: "Minimal query",
    tier: "hard",
  },
  {
    id: "html_hard_fragment",
    language: "HTML",
    code: `<div class="container">
    <span>text</span>
</div>`,
    description: "Fragment without doctype",
    tier: "hard",
  },
  {
    id: "css_hard_one_rule",
    language: "CSS",
    code: `.button { background: blue; }`,
    description: "Single rule",
    tier: "hard",
  },
  {
    id: "lua_hard_no_local",
    language: "Lua",
    code: `function add(a, b)
    return a + b
end`,
    description: "Function without local",
    tier: "hard",
  },
  {
    id: "ps_hard_no_cmdlet",
    language: "PowerShell",
    code: `$x = 5
$y = $x + 3
$result = $x * $y`,
    description: "Variables without cmdlets",
    tier: "hard",
  },
  {
    id: "php_hard_no_tags",
    language: "PHP",
    code: `class Calculator {
    public function add($a, $b) {
        return $a + $b;
    }
}`,
    description: "Class without PHP tags",
    tier: "hard",
  },
  {
    id: "scala_hard_minimal",
    language: "Scala",
    code: `val nums = List(1, 2, 3)
val doubled = nums.map(_ * 2)`,
    description: "Minimal Scala",
    tier: "hard",
  },
  {
    id: "haskell_hard_minimal",
    language: "Haskell",
    code: `add x y = x + y
result = add 3 4`,
    description: "Minimal function definition",
    tier: "hard",
  },

  // ============================================================
  // SUPER HARD TESTS - Cross-language confusion
  // ============================================================
  {
    id: "py_super_misleading_comment",
    language: "Python",
    code: `// This looks like JavaScript
def greet():
    return "hello"`,
    description: "Python with JS-style comment",
    tier: "super_hard",
  },
  {
    id: "js_super_python_content",
    language: "JavaScript",
    code: `const pythonCode = \`
def hello():
    print("world")
\`;
console.log(pythonCode);`,
    description: "JS containing Python string",
    tier: "super_hard",
  },
  {
    id: "java_super_csharp_style",
    language: "Java",
    code: `var result = users.stream()
    .filter(u -> u.isActive())
    .map(u -> u.getName())
    .toList();`,
    description: "Java with C# var style",
    tier: "super_hard",
  },
  {
    id: "cpp_super_c_style",
    language: "C++",
    code: `void* ptr = malloc(sizeof(int) * 10);
int* arr = (int*)ptr;
for (int i = 0; i < 10; i++) {
    arr[i] = i;
}
free(ptr);`,
    description: "C++ written as C",
    tier: "super_hard",
  },
  {
    id: "ts_super_any_types",
    language: "TypeScript",
    code: `function process(data: any): any {
    return data.map((x: any) => x.value);
}`,
    description: "TypeScript with all any",
    tier: "super_hard",
  },
  {
    id: "go_super_rust_comment",
    language: "GO",
    code: `// This looks like Rust code
fn main() {
    fmt.Println("Hello")
}

func main() {
    fmt.Println("Hello")
}`,
    description: "Go with Rust-style comment",
    tier: "super_hard",
  },
  {
    id: "rust_super_format_macro",
    language: "Rust",
    code: `fn greet(name: &str) -> String {
    format!("{}", name)
}`,
    description: "Rust without println!",
    tier: "super_hard",
  },
  {
    id: "shell_super_python_heredoc",
    language: "Shell",
    code: `#!/bin/bash
python3 <<EOF
def hello():
    print("world")
hello()
EOF
echo "Done"`,
    description: "Shell with Python heredoc",
    tier: "super_hard",
  },
  {
    id: "csharp_super_java_style",
    language: "C#",
    code: `public class UserService {
    private readonly IUserRepository repository;

    public UserService(IUserRepository repository) {
        this.repository = repository;
    }

    public User FindById(int id) {
        return repository.FindById(id);
    }
}`,
    description: "C# written Java-style",
    tier: "super_hard",
  },
  {
    id: "ruby_super_python_style",
    language: "Ruby",
    code: `def factorial(n)
  return 1 if n <= 1
  n * factorial(n - 1)
end`,
    description: "Ruby with Python-style indentation",
    tier: "super_hard",
  },
  {
    id: "cmake_super_shell_heavy",
    language: "CMake",
    code: `execute_process(
    COMMAND \${CMAKE_COMMAND} -E echo "Building..."
    WORKING_DIRECTORY \${CMAKE_SOURCE_DIR}
)
execute_process(
    COMMAND make -j4
    WORKING_DIRECTORY \${CMAKE_SOURCE_DIR}/build
)`,
    description: "CMake mostly shell commands",
    tier: "super_hard",
  },
  {
    id: "js_super_jsdoc",
    language: "JavaScript",
    code: `/**
 * @param {string} name
 * @returns {string}
 */
function greet(name) {
    return \`Hello, \${name}\`;
}`,
    description: "JS with TypeScript-like JSDoc",
    tier: "super_hard",
  },
  {
    id: "py_super_typed",
    language: "Python",
    code: `def greet(name: str) -> str:
    return f"Hello, {name}"

result: str = greet("World")`,
    description: "Python with heavy type hints",
    tier: "super_hard",
  },
  {
    id: "perl_super_minimal",
    language: "Perl",
    code: `sub add {
    my ($a, $b) = @_;
    return $a + $b;
}`,
    description: "Perl without distinctive sigils",
    tier: "super_hard",
  },

  // ============================================================
  // EXTREME TESTS - Polyglot/ambiguous code
  // ============================================================
  {
    id: "polyglot_c_cpp",
    language: "C",
    code: `#include <stdio.h>
int max(int a, int b) {
    return a > b ? a : b;
}`,
    description: "Valid in C and C++",
    tier: "extreme",
  },
  {
    id: "polyglot_js_ts",
    language: "JavaScript",
    code: `var greet = name => \`Hello, \${name}\`;
module.exports = { greet };`,
    description: "Valid in JS and TS",
    tier: "extreme",
  },
  {
    id: "polyglot_java_csharp",
    language: "Java",
    code: `@Override
public int add(int a, int b) {
    return a + b;
}`,
    description: "Similar in Java and C#",
    tier: "extreme",
  },
  {
    id: "polyglot_py_ruby_assign",
    language: "Python",
    code: `def add(x, y):
    return x + y
z = add(1, 2)
print(f"sum: {z}")`,
    description: "Similar in Python and Ruby",
    tier: "extreme",
  },
  {
    id: "polyglot_sql_ansi",
    language: "SQL",
    code: `SELECT id, name FROM users WHERE active = true ORDER BY name LIMIT 10`,
    description: "ANSI SQL",
    tier: "extreme",
  },
  {
    id: "extreme_empty_braces",
    language: "JavaScript",
    code: `console.log({})`,
    description: "Empty object literal",
    tier: "extreme",
  },
  {
    id: "extreme_single_number",
    language: "Python",
    code: `[x for x in range(5)]`,
    description: "Single expression",
    tier: "extreme",
  },
  {
    id: "extreme_comment_only_slash",
    language: "JavaScript",
    code: `// comment
console.log("test")`,
    description: "Slash comment style",
    tier: "extreme",
  },
  {
    id: "extreme_comment_only_hash",
    language: "Python",
    code: `# comment
def foo():
    pass`,
    description: "Hash comment style",
    tier: "extreme",
  },
  {
    id: "extreme_json_literal",
    language: "JavaScript",
    code: `const obj = {"name": "test", "value": 42};
console.log(\`name: \${obj.name}\`);`,
    description: "JSON-like object",
    tier: "extreme",
  },
  {
    id: "extreme_math_expr",
    language: "Python",
    code: `print(1 + 2 * 3)`,
    description: "Math expression",
    tier: "extreme",
  },
  {
    id: "extreme_string_only",
    language: "JavaScript",
    code: `const msg = \`hello world\`;
console.log(msg);`,
    description: "String constant",
    tier: "extreme",
  },
  {
    id: "extreme_array_literal",
    language: "Python",
    code: `def double(nums):
    return [x * 2 for x in nums]`,
    description: "Array/list operation",
    tier: "extreme",
  },
];

// Helper functions for filtering and grouping
export const languages = [...new Set(testCases.map((t) => t.language))].sort();

export const tiers: Tier[] = ["baseline", "hard", "super_hard", "extreme"];

export const tierLabels: Record<Tier, string> = {
  baseline: "Baseline",
  hard: "Hard",
  super_hard: "Super Hard",
  extreme: "Extreme",
};

export const tierDescriptions: Record<Tier, string> = {
  baseline: "Clear language markers and distinctive syntax",
  hard: "Minimal distinctive features, could be multiple languages",
  super_hard: "Misleading comments, embedded code, cross-language styles",
  extreme: "Polyglot code valid in multiple languages, ambiguous snippets",
};

export const tierColors: Record<Tier, string> = {
  baseline: "bg-emerald-500/20 text-emerald-400 border-emerald-500/50",
  hard: "bg-amber-500/20 text-amber-400 border-amber-500/50",
  super_hard: "bg-orange-500/20 text-orange-400 border-orange-500/50",
  extreme: "bg-red-500/20 text-red-400 border-red-500/50",
};

export function getTestsByLanguage(language: string): TestCase[] {
  return testCases.filter((t) => t.language === language);
}

export function getTestsByTier(tier: Tier): TestCase[] {
  return testCases.filter((t) => t.tier === tier);
}

export function groupByLanguage(): Record<string, TestCase[]> {
  return testCases.reduce(
    (acc, test) => {
      if (!acc[test.language]) {
        acc[test.language] = [];
      }
      acc[test.language].push(test);
      return acc;
    },
    {} as Record<string, TestCase[]>
  );
}

export function getStats() {
  return {
    total: testCases.length,
    languages: languages.length,
    byTier: {
      baseline: testCases.filter((t) => t.tier === "baseline").length,
      hard: testCases.filter((t) => t.tier === "hard").length,
      super_hard: testCases.filter((t) => t.tier === "super_hard").length,
      extreme: testCases.filter((t) => t.tier === "extreme").length,
    },
  };
}
