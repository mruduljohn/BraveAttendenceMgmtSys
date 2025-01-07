import psycopg2

# Database connection details
DB_HOST = "localhost"
DB_NAME = "Test_Server"
DB_USER = "postgres"
DB_PASSWORD = "1234"

try:
    # Connect to the PostgreSQL database
    connection = psycopg2.connect(
        host=DB_HOST,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD
    )
    cursor = connection.cursor()

    # Query to select all data from the USERS table
    select_users_query = "SELECT * FROM USERS;"
    cursor.execute(select_users_query)
    users = cursor.fetchall()
    print("USERS Table Data:")
    for user in users:
        print(user)

    # Query to select all data from the LEAVE_REQUESTS table
    select_leave_requests_query = "SELECT * FROM LEAVE_REQUESTS;"
    cursor.execute(select_leave_requests_query)
    leave_requests = cursor.fetchall()
    print("\nLEAVE_REQUESTS Table Data:")
    for leave_request in leave_requests:
        print(leave_request)

    # Query to select all data from the ATTENDANCE table
    select_attendance_query = "SELECT * FROM ATTENDANCE;"
    cursor.execute(select_attendance_query)
    attendance = cursor.fetchall()
    print("\nATTENDANCE Table Data:")
    for record in attendance:
        print(record)

except (Exception, psycopg2.DatabaseError) as error:
    print(f"Error while connecting to PostgreSQL: {error}")

finally:
    # Close the database connection
    if cursor:
        cursor.close()
    if connection:
        connection.close()
