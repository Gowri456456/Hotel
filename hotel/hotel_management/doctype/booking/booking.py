import frappe
from frappe.website.website_generator import WebsiteGenerator


class Booking(WebsiteGenerator):

    def validate(self):

        # Number of guests validation
        if self.number_of_guest:

            if self.number_of_guest < 1:
                frappe.throw(
                    "Number of guests must be at least 1."
                )

            if self.number_of_guest > 4:
                frappe.throw(
                    "One room can accommodate a maximum of 4 guests."
                )

        # Date validation
        if self.check_in_date and self.check_out_date:

            if self.check_out_date <= self.check_in_date:
                frappe.throw(
                    "Check Out Date must be after Check In Date."
                )

				        # Room availability validation
        if (
            self.room
            and self.check_in_date
            and self.check_out_date
        ):

            existing_bookings = frappe.get_all(
                "Booking",
                filters={
                    "room": self.room,
                    "check_in_date": ["<", self.check_out_date],
                    "check_out_date": [">", self.check_in_date],
                    "name": ["!=", self.name]
                },
                fields=[
                    "name",
                    "check_in_date",
                    "check_out_date"
                ]
            )

            if existing_bookings:

                booking = existing_bookings[0]

                frappe.throw(
                    f"Room {self.room} is already booked "
                    f"from {booking.check_in_date} "
                    f"to {booking.check_out_date}."
                )