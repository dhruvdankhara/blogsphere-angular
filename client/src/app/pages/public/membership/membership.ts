import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-membership',
  imports: [RouterLink, Button],
  templateUrl: './membership.html',
  styleUrl: './membership.css',
})
export class Membership {}
