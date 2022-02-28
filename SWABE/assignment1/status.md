# STATUS
Lav en REST API som kan håndtere login samt status over et hotel.
API'en skal overholde routesne beskrevet i `Routes overview`

## TODO
- Rooms
- Reservations

## Complete
- User/authentication

# Routes overview
- `/login` - `POST` Bruger sender login information og modtager en JWT hvis info er korrekt
- `/user` - `POST` Oprettelse af bruger
- `/users`
    - `GET /` Liste af alle brugere
    - `GET /{:uid}` får specifik bruger
- `/rooms`
    - `GET /` - list all roles
    - `GET /{:uid}` - view room details
    - `POST /rooms/{:uid}`–create room. Accessible for roles `manager`
    - `PATCH /rooms/{:uid}`–modify room. Accessible for roles `manager`, `clerk`
    - `DELETE /rooms/{:uid}`–delete room. Accessible for roles `manager`
- `/reservations`
    - `GET /` - List all reservations. 
        - Accessible for roles `manager` and `clerk`
        - Needs filter possibilities
    - `GET /{:uid}` - View specific reservation. 
        - Accessible for roles `manager`, `clerk`, and `guest` (if created by `guest`)
    - `POST /{:uid}` - Create new reservation 
        - Accessible for roles `manager`, `clerk`, and `guest` 
    - `PATCH /{:uid}` - Modify a given reservation. 
        - Accessible for roles `manager`, `clerk`, and `guest` (if created by `guest`) 
    - `DELETE /{:uid}` - Delete a reservation. 
        - Accessible for roles `manager`, `clerk`