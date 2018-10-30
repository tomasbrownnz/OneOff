import { job } from './job'

export interface Profile{
	Id: string;
	phoneNumber: string;
	email: string;
	address: string;
	firstName: string;
	lastName: string;
	bio: string;
	age: number;
	car: boolean;
}