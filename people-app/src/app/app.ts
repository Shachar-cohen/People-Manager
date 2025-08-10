// handles login screen, view switching (add/delete/update/show),
// client-side validation, and calling the PeopleService (CRUD).

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PeopleService } from './services/people.service';
import { Person } from './models/person';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {

  // Login state
  loginVisible = true;
  username = '';
  password = '';
  loginError = '';

  // View state
  addPeopleVisible = false;
  deletePeopleVisible = false;
  showPeopleVisible = false;
  updatePeopleVisible = false;

  // Data
  searchTerm = '';
  people: Person[] = [];

  // Add / Edit form fields
  firstName = '';
  lastName = '';
  personId = '';
  email = '';
  phone = '';

  // Status messages
  addStatusMessage = '';
  deletionMessage = '';
  updateStatusMessage = '';

  // Delete modal
  confirmDeleteVisible = false;
  candidateToDelete: Person | null = null;

  // Update mode
  editMode = false;
  selectedPersonId: string | null = null;

  // Undo support: keep the last deleted person for a short time window
  lastDeletedPerson: Person | null = null;

  constructor(private peopleService: PeopleService) {}

  // Login
  login(): void {
    if (this.username === 'admin' && this.password === '1234') {
      this.loginVisible = false;
      this.loginError = '';
      // this.loadPeople(); // optional: preload list after login
    } else {
      this.loginError = 'Invalid username or password';
    }
  }

  private clearAll() {
    this.addPeopleVisible = false;
    this.deletePeopleVisible = false;
    this.showPeopleVisible = false;
    this.updatePeopleVisible = false;
    this.confirmDeleteVisible = false;

    this.addStatusMessage = '';
    this.deletionMessage = '';
    this.updateStatusMessage = '';

    this.candidateToDelete = null;
    this.searchTerm = '';
    this.editMode = false;

    // do not clear lastDeletedPerson here; we want the user to be able to press Undo
  }

  private loadPeople(): void {
    this.peopleService.getPeople().subscribe({
      next: data => this.people = data ?? [],
      error: _ => this.people = []
    });
  }

  AddPeople(): void {
    this.clearAll();
    this.addPeopleVisible = true;
    this.loadPeople();
  }

  DeletePeople(): void {
    this.clearAll();
    this.deletePeopleVisible = true;
    this.loadPeople();
  }

  ShowPeople(): void {
    this.clearAll();
    this.showPeopleVisible = true;
    this.loadPeople();
  }

  UpdatePeople(): void {
    this.clearAll();
    this.updatePeopleVisible = true;
    this.loadPeople();
  }

  // Add
  PeopleSubmit(): void {
    if (!this.firstName.trim() || !this.lastName.trim() || !this.personId.trim() ||
        !this.email.trim() || !this.phone.trim()) {
      this.addStatusMessage = 'All fields are required.'; return;
    }
    if (/\d/.test(this.firstName) || /\d/.test(this.lastName)) {
      this.addStatusMessage = 'Name cannot contain numbers.'; return;
    }
    if (!/^\d{9}$/.test(this.personId)) {
      this.addStatusMessage = 'ID must be exactly 9 digits.'; return;
    }
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRx.test(this.email)) {
      this.addStatusMessage = 'Invalid email format.'; return;
    }
    if (!/^05\d{7,8}$/.test(this.phone)) {
      this.addStatusMessage = 'Phone must start with 05 and be 9–10 digits.'; return;
    }

    if (this.people.some(p => p.id === this.personId)) {
      this.addStatusMessage = 'ID already exists—please enter a different one.'; return;
    }
    if (this.people.some(p => p.email.toLowerCase() === this.email.toLowerCase())) {
      this.addStatusMessage = 'Email already exists—please enter a different one.'; return;
    }
    if (this.people.some(p => p.phone === this.phone)) {
      this.addStatusMessage = 'Phone number already exists—please enter a different one.'; return;
    }

    const person: Person = {
      id: this.personId,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone
    };

    this.peopleService.addPerson(person).subscribe({
      next: res => {
        this.addStatusMessage = res?.message || 'Person added successfully.';
        this.loadPeople();
        this.clearAddForm();
        setTimeout(() => this.addStatusMessage = '', 3000);
      },
      error: err => {
        this.addStatusMessage =
          err?.error?.message ||
          (err?.error?.errors ? (Object.values(err.error.errors) as any[]).flat().join(' | ') : '') ||
          'Error adding person.';
      }
    });
  }

  private clearAddForm(): void {
    this.firstName = '';
    this.lastName = '';
    this.personId = '';
    this.email = '';
    this.phone = '';
  }

  // Delete
  askDelete(person: Person): void {
    this.deletionMessage = '';
    this.candidateToDelete = person;
    this.confirmDeleteVisible = true;
  }

  confirmDelete(): void {
    if (!this.candidateToDelete) return;

    const id = this.candidateToDelete.id;
    const justDeleted = this.candidateToDelete; // keep a ref for Undo UI
    this.confirmDeleteVisible = false;

    this.peopleService.deletePerson(id).subscribe({
      next: res => {
        this.deletionMessage = res?.message || 'Person deleted successfully.';
        this.lastDeletedPerson = justDeleted; // enable Undo
        // update local list immediately
        this.people = this.people.filter(p => p.id !== id);
        this.candidateToDelete = null;

        // keep the message long enough for the user to click Undo
        setTimeout(() => {
          this.deletionMessage = '';
          this.lastDeletedPerson = null;
        }, 7000);
      },
      error: err => {
        this.deletionMessage = err?.error?.message || 'Error deleting person.';
      }
    });
  }

  // Undo last delete
  undoLastDelete(): void {
    if (!this.lastDeletedPerson) return;

    const id = this.lastDeletedPerson.id;

    this.peopleService.undoDelete(id).subscribe({
      next: res => {
        this.deletionMessage = res?.message || 'Person restored successfully.';
        this.lastDeletedPerson = null;
        this.loadPeople();
        setTimeout(() => this.deletionMessage = '', 3000);
      },
      error: err => {
        this.deletionMessage = err?.error?.message || 'Undo failed.';
      }
    });
  }

  cancelDelete(): void {
    this.confirmDeleteVisible = false;
    this.candidateToDelete = null;
  }

  // Update
  editPerson(person: Person): void {
    this.selectedPersonId = person.id;
    this.firstName = person.firstName;
    this.lastName = person.lastName;
    this.email = person.email;
    this.phone = person.phone;
    this.editMode = true;
  }

  submitUpdate(): void {
    if (!this.selectedPersonId) return;

    const updated: Person = {
      id: this.selectedPersonId,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone
    };

    this.peopleService.updatePerson(this.selectedPersonId, updated).subscribe({
      next: res => {
        this.updateStatusMessage = res?.message || 'Person updated successfully.';
        this.loadPeople();
        setTimeout(() => {
          this.updateStatusMessage = '';
          this.editMode = false;
        }, 2000);
      },
      error: err => {
        this.updateStatusMessage = err?.error?.message || 'Error updating person.';
      }
    });
  }

  // Filter
  getFilteredPeople(): Person[] {
    if (!this.searchTerm) return this.people;
    const term = this.searchTerm.toLowerCase();
    return this.people.filter(p =>
      (`${p.firstName} ${p.lastName}`).toLowerCase().includes(term)
    );
  }
}

