import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, Box, Card, CardContent, Snackbar } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TableChartIcon from '@mui/icons-material/TableChart';
import Grid from '@mui/material/Grid';
import Calendar from './dashboard/calender'; 
import CustomerTable from './dashboard/cutomertable'; 
import Header from './header';
import EmployeeTimesheet from './dashboard/emptime';

const drawerWidth = 240;

const Home = () => {
  const [selectedComponent, setSelectedComponent] = useState('calendar');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const history = useHistory();

  const handleLogout = () => {
    
    console.log('Logged out');
    history.push('/login');
  };

  const handleListItemClick = (component) => {
    setSelectedComponent(component);
  };

  const handleSnackbarClose = () => {
    setShowSnackbar(false);
  };

  const handleUpdateSuccess = () => {
    setSnackbarMessage('Update successful');
    setShowSnackbar(true);
  };

  const handleDeleteSuccess = () => {
    setSnackbarMessage('Delete successful');
    setShowSnackbar(true);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Home Page
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <List>
          <ListItem button onClick={() => handleListItemClick('calendar')}>
            <ListItemIcon>
              <CalendarTodayIcon />
            </ListItemIcon>
            <ListItemText primary="Calendar" />
          </ListItem>
          <ListItem button onClick={() => handleListItemClick('customerTable')}>
            <ListItemIcon>
              <TableChartIcon />
            </ListItemIcon>
            <ListItemText primary="Customer Table" />
          </ListItem>
        </List>
        <Header handleLogout={handleLogout} />
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
        <Toolbar />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {selectedComponent === 'calendar' && (
              <Card>
                <CardContent>
                  <Calendar />
                </CardContent>
              </Card>
            )}
            {selectedComponent === 'customerTable' && (
              <Card>
                <CardContent>
                  <CustomerTable
                    onUpdateSuccess={handleUpdateSuccess}
                    onDeleteSuccess={handleDeleteSuccess}
                  />
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default Home;
