import { Component } from '@angular/core';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-contact',
  imports: [InputText, Textarea, Button],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {}
