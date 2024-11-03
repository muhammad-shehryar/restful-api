// src/UserList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserList = () => {
   const [users, setUsers] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState('');
   const [name, setName] = useState('');
   const [email, setEmail] = useState('');
   const [editingUser, setEditingUser] = useState(null);
   const [searchTerm, setSearchTerm] = useState('');

   // Fetch users from API on component mount
   useEffect(() => {
      const fetchUsers = async () => {
         try {
            const response = await axios.get('https://jsonplaceholder.typicode.com/users');
            setUsers(response.data);
         } catch (err) {
            setError('Error fetching users');
         } finally {
            setLoading(false);
         }
      };

      fetchUsers();
   }, []);

   // Add new user with POST request
   const addUser = async (e) => {
      e.preventDefault();
      try {
         const response = await axios.post('https://jsonplaceholder.typicode.com/users', {
            name,
            email,
         });
         setUsers((prevUsers) => [...prevUsers, response.data]);
         setName('');
         setEmail('');
      } catch (err) {
         setError('Error adding user');
      }
   };

   // Edit user details
   const editUser = (user) => {
      setEditingUser(user);
      setName(user.name);
      setEmail(user.email);
   };

   // Update user with PUT request
   const updateUser = async (e) => {
      e.preventDefault();
      try {
         const response = await axios.put(`https://jsonplaceholder.typicode.com/users/${editingUser.id}`, {
            name,
            email,
         });
         setUsers((prevUsers) =>
            prevUsers.map((user) =>
               user.id === editingUser.id ? response.data : user
            )
         );
         setEditingUser(null);
         setName('');
         setEmail('');
      } catch (err) {
         setError('Error updating user');
      }
   };

   const deleteUser=async(userId)=>{
    try{
      await axios.delete(`https://jsonplaceholder.typicode.com/users/${userId}`)
      setUsers((prevUsers)=>prevUsers.filter((user)=>user.id !== userId))
    }catch(error){
        setError('Error deleting user')
    }
   }

   const filteredUsers= users.filter((user)=>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())

    )

   if (loading) return <p>Loading...</p>;
   if (error) return <p>{error}</p>;

   return (
      <div>
         <h2>User List</h2>
         <input
            type="text"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginBottom: '20px', padding: '8px', width: '100%' }}
         />
         <ul>
            {filteredUsers.map((user) => (
               <li key={user.id}>
                  {user.name} - {user.email}
                  <button onClick={() => editUser(user)}>Edit</button>
                  <button onClick={()=> deleteUser(user.id)}>Delete</button>
               </li>
            ))}
         </ul>

         <h3>{editingUser ? 'Edit User' : 'Add New User'}</h3>
         <form onSubmit={editingUser ? updateUser : addUser}>
            <input
               type="text"
               placeholder="Name"
               value={name}
               onChange={(e) => setName(e.target.value)}
               required
            />
            <input
               type="email"
               placeholder="Email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               required
            />
            <button type="submit">{editingUser ? 'Update User' : 'Add User'}</button>
         </form>
      </div>
   );
};

export default UserList;
