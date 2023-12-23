class Person {
  id: string;
  full_name: string;
  age: number;
  email: string;
  constructor(id: string, fullName: string, age: number, email: string) {
    this.id = id;
    this.full_name = fullName;
    this.age = age;
    this.email = email;
  }
}
export default Person;
