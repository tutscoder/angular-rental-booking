import { Component, OnInit } from "@angular/core";

import { Rental } from "../shared/rental.model";
import { RentalService } from "../shared/rental.service";
@Component({
  selector: "app-rental-listing",
  templateUrl: "./rental-listing.component.html",
  styleUrls: ["./rental-listing.component.scss"],
})
export class RentalListingComponent implements OnInit {
  constructor(private rentalService: RentalService) {}

  rentals: Rental[] = [];
  someData = "Some Data1";
  isLoaded = false;

  ngOnInit() {
    this.rentalService.getRentals().subscribe((rentals: Rental[]) => {
      this.rentals = rentals;
    });
  }
}
