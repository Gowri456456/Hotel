frappe.ui.form.on('Booking', {

    refresh(frm) {
        set_room_filter(frm);
        calculate_booking(frm);
    },

    room_type(frm) {
        frm.set_value('room', '');
        frm.set_value('room_rate', 0);
        set_room_filter(frm);
    },

    room(frm) {
        if (frm.doc.room) {

            frappe.db.get_value(
                'Room',
                frm.doc.room,
                'price_per_night'
            ).then(r => {

                if (r.message) {
                    frm.set_value(
                        'room_rate',
                        r.message.price_per_night
                    );

                    calculate_booking(frm);
                }
            });
        }
    },

 

    check_in_date(frm) {
        calculate_booking(frm);
    },

    check_out_date(frm) {
        calculate_booking(frm);
    },

    room_rate(frm) {
        calculate_booking(frm);
    }
});


function set_room_filter(frm) {

    frm.set_query('room', function() {

        return {
            filters: {
                room_type: frm.doc.room_type,
                status: 'Available'
            }
        };

    });
}


function calculate_booking(frm) {

    if (
        frm.doc.check_in_date &&
        frm.doc.check_out_date
    ) {

        let nights = frappe.datetime.get_day_diff(
            frm.doc.check_out_date,
            frm.doc.check_in_date
        );

        if (nights <= 0) {

            frappe.msgprint(
                'Check Out Date must be after Check In Date'
            );

            frm.set_value('number_of_nights', 0);
            frm.set_value('total_amount', 0);

            return;
        }

        frm.set_value(
            'number_of_nights',
            nights
        );

        if (frm.doc.room_rate) {

            let total =
                nights * frm.doc.room_rate;

            frm.set_value(
                'total_amount',
                total
            );
        }
    }
}