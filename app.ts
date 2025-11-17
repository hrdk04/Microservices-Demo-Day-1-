import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Item {
  _id?: string;
  itemName: string;
  itemImage?: string;
  itemPrice: number;
  itemQuentity: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <!-- LOGIN/REGISTER -->
    <div *ngIf="!isLoggedIn" style="text-align:center; margin-top:50px;">
      <h2>Login</h2>
      <input [(ngModel)]="login.email" placeholder="Email" style="display:block; margin:10px auto; padding:8px; width:250px;">
      <input [(ngModel)]="login.password" type="password" placeholder="Password" style="display:block; margin:10px auto; padding:8px; width:250px;">
      <button (click)="doLogin()" style="padding:10px 20px; margin:5px;">Login</button>
      
      <p>Don't have an account? <a (click)="showRegister=true" style="cursor:pointer; color:blue;">Register</a></p>

      <div *ngIf="showRegister" style="margin-top:30px;">
        <h2>Register</h2>
        <input [(ngModel)]="register.email" placeholder="Email" style="display:block; margin:10px auto; padding:8px; width:250px;">
        <input [(ngModel)]="register.password" type="password" placeholder="Password" style="display:block; margin:10px auto; padding:8px; width:250px;">
        <button (click)="doRegister()" style="padding:10px 20px;">Register</button>
      </div>
    </div>

    <!-- CRUD PAGE -->
    <div *ngIf="isLoggedIn" style="padding:20px;">
      <h2>Welcome {{loggedInUser}}! <button (click)="logout()" style="float:right; padding:10px;">Logout</button></h2>
      <hr style="clear:both;">

      <h3>Add/Edit Item</h3>
      <div style="max-width:400px;">
        <input [(ngModel)]="itemForm.itemName" placeholder="Item Name" style="width:100%; padding:8px; margin:5px 0;" required>
        <input [(ngModel)]="itemForm.itemPrice" type="number" placeholder="Price" style="width:100%; padding:8px; margin:5px 0;" required>
        <input [(ngModel)]="itemForm.itemQuentity" type="number" placeholder="Quantity" style="width:100%; padding:8px; margin:5px 0;" required>
        <input type="file" (change)="onFileChange($event)" style="width:100%; padding:8px; margin:5px 0;">
        <img *ngIf="imagePreview" [src]="imagePreview" width="100" style="margin-top:10px;">
        <button (click)="saveItem()" style="margin-top:10px; padding:10px; width:100%;">{{ editId ? 'Update' : 'Add' }} Item</button>
        <button *ngIf="editId" (click)="resetForm()" style="margin-top:5px; padding:10px; width:100%; background:#ccc;">Cancel</button>
      </div>

      <h3>Items List (Total: {{items.length}})</h3>
      <table border="1" width="100%" style="border-collapse:collapse;">
        <tr>
          <th>Name</th><th>Price</th><th>Qty</th><th>Image</th><th>Actions</th>
        </tr>
        <tr *ngFor="let i of items">
          <td>{{i.itemName}}</td>
          <td>{{i.itemPrice}}</td>
          <td>{{i.itemQuentity}}</td>
          <td><img *ngIf="i.itemImage" [src]="i.itemImage" width="80"></td>
          <td>
            <button (click)="editItem(i)" style="margin:2px; padding:5px 10px; background:#ffc107;">Edit</button>
            <button (click)="deleteItem(i._id)" style="margin:2px; padding:5px 10px; background:#dc3545; color:white;">Delete</button>
          </td>
        </tr>
      </table>
      <p *ngIf="items.length === 0" style="text-align:center; color:#999; padding:20px;">No items yet. Add your first item!</p>
    </div>
  `
})
export class App implements OnInit {
  api = 'http://localhost:5000';

  // Auth state
  isLoggedIn = false;
  loggedInUser = '';
  showRegister = false;
  login = { email: '', password: '' };
  register = { email: '', password: '' };

  // Item state
  itemForm: Partial<Item> = {
    itemName: '',
    itemPrice: 0,
    itemQuentity: 0,
    itemImage: ''
  };
  items: Item[] = [];
  editId: string | null = null;
  imagePreview: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Check if already logged in
    if (typeof window !== 'undefined') {
      const email = localStorage.getItem('email');
      if (email) {
        this.isLoggedIn = true;
        this.loggedInUser = email;
        this.loadItems();
      }
    }
  }

  // ===== AUTH METHODS =====
  doLogin() {
    this.http.post<any>(`${this.api}/login`, this.login).subscribe({
      next: (res) => {
        console.log('Login response:', res);
        if (res.loggedIn) {
          localStorage.setItem('email', res.email);
          this.isLoggedIn = true;
          this.loggedInUser = res.email;
          this.login = { email: '', password: '' };
          this.loadItems();
        } else {
          alert('Invalid credentials!');
        }
      },
      error: (err) => {
        console.error('Login error:', err);
        alert('Login error');
      }
    });
  }

  doRegister() {
    this.http.post<any>(`${this.api}/register`, this.register).subscribe({
      next: (res) => {
        alert(res.msg);
        this.showRegister = false;
        this.register = { email: '', password: '' };
      },
      error: (err) => {
        console.error('Registration error:', err);
        alert('Registration error');
      }
    });
  }

  logout() {
    localStorage.removeItem('email');
    this.isLoggedIn = false;
    this.loggedInUser = '';
    this.items = [];
  }

  // ===== ITEM METHODS =====
  loadItems() {
    console.log('Loading items...');
    this.http.get<Item[]>(`${this.api}/item`).subscribe({
      next: (data) => {
        console.log('Items loaded:', data);
        this.items = data;
      },
      error: (err) => {
        console.error('Failed to load items:', err);
        alert('Failed to load items');
      }
    });
  }

  onFileChange(e: any) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.itemForm.itemImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  saveItem() {
    // Validate
    if (!this.itemForm.itemName || !this.itemForm.itemPrice || !this.itemForm.itemQuentity) {
      alert('Please fill all required fields');
      return;
    }

    console.log('Saving item:', this.itemForm);

    if (this.editId) {
      // UPDATE
      this.http.put(`${this.api}/item/${this.editId}`, this.itemForm).subscribe({
        next: (res) => {
          console.log('Update response:', res);
          alert('Item updated!');
          this.loadItems();
          this.resetForm();
        },
        error: (err) => {
          console.error('Update failed:', err);
          alert('Update failed');
        }
      });
    } else {
      // CREATE
      this.http.post(`${this.api}/item`, this.itemForm).subscribe({
        next: (res) => {
          console.log('Create response:', res);
          alert('Item added!');
          this.loadItems();
          this.resetForm();
        },
        error: (err) => {
          console.error('Create failed:', err);
          alert('Create failed');
        }
      });
    }
  }

  editItem(item: Item) {
    this.itemForm = { ...item };
    this.editId = item._id!;
    this.imagePreview = item.itemImage;
    window.scrollTo(0, 0);
  }

  deleteItem(id?: string) {
    if (id && confirm('Delete this item?')) {
      this.http.delete(`${this.api}/item/${id}`).subscribe({
        next: () => {
          alert('Item deleted!');
          this.loadItems();
        },
        error: (err) => {
          console.error('Delete failed:', err);
          alert('Delete failed');
        }
      });
    }
  }

  resetForm() {
    this.itemForm = {
      itemName: '',
      itemPrice: 0,
      itemQuentity: 0,
      itemImage: ''
    };
    this.editId = null;
    this.imagePreview = null;
  }
}