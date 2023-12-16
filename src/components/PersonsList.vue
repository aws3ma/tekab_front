<template>
    <div class="m-4">
        <form id="app">

            <div class="flex flex-row items-center gap-2">
                <label for="name" class="text-lg">Name</label>
                <input id="name" v-model="person.fullName" type="text" name="name" class="rounded-md">
                <label for="age" class="text-lg">Age</label>
                <input id="age" v-model="person.age" type="number" name="age" min="0" class="rounded-md">
                <!-- <input type="submit" value="Add"> -->
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
        </form>

        <table class="w-2/5 text-md text-left mt-4">
            <tr>
                <th>Full name</th>
                <th>Age</th>
                <th>Action</th>
            </tr>
            <tr v-for="person in personList" :key="person.id">
                <td>{{ person.fullName }}</td>
                <td>{{ person.age }}</td>
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


export default defineComponent({
    name: "App",
    data() {
        return {
            personList: [] as Person[],
            person: new Person('', '', 0),
            edit: false
        };
    },
    methods: {
        async getPersonList() {
            const data = await axios.get("https://entretien.oussema99trabelsi.workers.dev/api/users");
            data.data.forEach((element: any) => {
                const p = new Person(element.id, element.full_name, element.age)
                this.personList.push(p)
            });
            // this.personList = data.data;
        },
        async addPerson() {
            const data = await axios.post("https://entretien.oussema99trabelsi.workers.dev/api/user", { 'fullName': this.person.fullName, 'age': this.person.age })
            this.personList.push(data.data[0])
        },
        async editPerson(id: string) {
            if (id === '') {
                const data = await axios.put("https://entretien.oussema99trabelsi.workers.dev/api/user", { 'fullName': this.person.fullName, 'age': this.person.age, 'id': this.person.id })
                const index = this.personList.findIndex((obj: Person) => obj.id === this.person.id);
                console.log(index)
                const p = new Person(data.data[0].id, data.data[0].full_name, data.data[0].age)
                this.personList[index]=p;
                this.edit = false
            }
            else {
                const toEdit = this.personList.find((obj: Person) => obj.id === id)
                console.log(toEdit)
                if (toEdit) {
                    this.person.id = toEdit.id
                    this.person.fullName = toEdit.fullName
                    this.person.age = toEdit.age
                    this.edit = true
                }
            }
        },
        async deletePerson(id: string) {
            const index = this.personList.findIndex(obj => obj.id === id);

            if (index !== -1) {
                this.personList.splice(index, 1); // Removes one element at the found index
            }
            const data = await axios.delete(`https://entretien.oussema99trabelsi.workers.dev/api/user/${id}`)
            console.log(data)
        }
    },
    beforeMount() {
        this.getPersonList();
    },
})
</script>
<style scoped></style>