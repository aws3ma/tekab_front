<template>
    <div class="m-4">
        <form>
            <div class="flex flex-row items-center gap-2">
                <label for="name" class="text-lg">Name</label>
                <input id="name" v-model="v$.form.full_name.$model" type="text" name="name" class="rounded-md"
                    placeholder="Full name">
                <label for="age" class="text-lg">Age</label>
                <input id="age" v-model="form.age" type="number" name="age" min="0" class="rounded-md">
                <label for="email" class="text-lg">Email</label>
                <input id="email" v-model="v$.form.email.$model" type="email" name="email" min="0" class="rounded-md">
                <button
                    class="flex p-2.5 bg-green-500 rounded-xl hover:rounded-3xl hover:bg-green-600 transition-all duration-300 text-white"
                    v-on:click="addPerson()" type="button" v-if="!edit">
                    <img src="../assets/img/add.png" alt="" srcset="" class="h-6 w-6">
                </button>
                <button
                    class="flex p-2.5 bg-yellow-500 rounded-xl hover:rounded-3xl hover:bg-yellow-600 transition-all duration-300 text-white"
                    v-on:click="editPerson('')" type="button" v-if="edit">
                    <img src="../assets/img/edit.png" alt="" srcset="" class="h-6 w-6">
                </button>
            </div>
            <div class="pl-4">
                <ul class="list-disc">
                    <li class="text-red-500" v-for="(error, index) of v$.form.full_name.$errors" :key="index">
                        {{ error.$message }}
                    </li>
                    <li class="text-red-500" v-for="(error, index) of v$.form.email.$errors" :key="index">
                        {{ error.$message }}
                    </li>
                </ul>
            </div>
        </form>
        <table class="w-2/5 text-md text-left mt-4">
            <tr>
                <th>Full name</th>
                <th>Age</th>
                <th>Email</th>
                <th>Action</th>
            </tr>
            <tr v-for="person in personList" :key="person.id">
                <td>{{ person.full_name }}</td>
                <td>{{ person.age }}</td>
                <td v-if="person.email">{{ person.email }}</td>
                <td v-if="!person.email">N/A</td>
                <td>
                    <div class="flex flex-row gap-1">
                        <button
                            class="flex p-2.5 bg-yellow-500 rounded-xl hover:rounded-3xl hover:bg-yellow-600 transition-all duration-300 text-white"
                            type="button" v-on:click="editPerson(person.id)">
                            <img src="../assets/img/edit.png" alt="" srcset="" class="h-4 w-4">
                        </button>
                        <button
                            class="flex p-2.5 bg-red-500 rounded-xl hover:rounded-3xl hover:bg-red-600 transition-all duration-300 text-white"
                            v-on:click="deletePerson(person.id)">
                            <img src="../assets/img/delete.png" alt="" srcset="" class="h-4 w-4">
                        </button>
                    </div>
                </td>
            </tr>
        </table>
    </div>
</template>
<script lang="ts">
import axios from "axios";
import { defineComponent } from "vue"
import Person from "@/models/Person";
import useVuelidate from '@vuelidate/core'
import { required, minLength, email } from '@vuelidate/validators'
export function validName(name: string) {
    let validNamePattern = new RegExp("^[a-zA-Z]+(?:['\\s][a-zA-Z]+)*$");
    if (name == '')
        return false;
    if (validNamePattern.test(name)) {
        return true;
    }
    return false;
}
export default defineComponent({
    name: "App",
    setup() {
        return {
            v$: useVuelidate()
        }
    },
    data() {
        return {
            personList: [] as Person[],
            edit: false,
            form: {
                id: '',
                full_name: '',
                age: 0,
                email: ''
            }
        };
    },
    methods: {
        async getPersonList() {
            const data = await axios.get("https://entretien.oussema99trabelsi.workers.dev/api/users");
            data.data.forEach((element: Person) => {
                const p = new Person(element.id, element.full_name, element.age, element.email)
                this.personList.push(p)
            });
        },
        async addPerson() {
            if (this.v$.$error) {
                return
            }
            if (!(this.form.full_name && this.form.email)) return
            const data: Person = (await axios.post("https://entretien.oussema99trabelsi.workers.dev/api/user", { full_name: this.form.full_name, age: this.form.age, email: this.form.email })).data[0]
            this.personList.push(data)
            this.form.id = ''
            this.form.age = 0
            this.form.full_name = ''
            this.form.email = ''
        },
        async editPerson(id: string) {
            if (id === '') {
                if (this.v$.$anyDirty)
                    return
                const data: Person = (await axios.put("https://entretien.oussema99trabelsi.workers.dev/api/user", { 'fullName': this.form.full_name, 'age': this.form.age, 'id': this.form.id })).data[0]
                const index = this.personList.findIndex((obj: Person) => obj.id === this.form.id);
                this.personList[index] = data;
                this.edit = false
                this.form.age = 0
                this.form.full_name = ''
                this.form.id = ''
            }
            else {
                const toEdit = this.personList.find((obj: Person) => obj.id === id)
                if (toEdit) {
                    this.form = toEdit
                    this.edit = true
                }
            }
        },
        async deletePerson(id: string) {
            const index = this.personList.findIndex(obj => obj.id === id);
            if (index !== -1) {
                this.personList.splice(index, 1); // Removes one element at the found index
            }
            await axios.delete(`https://entretien.oussema99trabelsi.workers.dev/api/user/${id}`)
        },
    },
    validations() {
        return {
            form: {
                full_name: {
                    required,
                    $autoDirty: true,
                    minLength: minLength(2),
                    name_validation: {
                        $validator: validName,
                        $message: 'Invalid Name.'
                    }
                },
                email: {
                    required,

                    email,
                    // name_validation: {
                    //     $validator: email,
                    //     $message: 'Invalid email.'
                    // }
                }
            }
        }
    },
    beforeMount() {
        this.getPersonList();
    },
})
</script>
<style scoped></style>