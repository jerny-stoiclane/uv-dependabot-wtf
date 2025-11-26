import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

const SectionNavigation = ({ sections, activeSection, scrollToSection }) => {
  return (
    <>
      <List sx={{ p: 0, width: '100%' }}>
        {sections.map(({ label, icon, id }) => (
          <ListItemButton
            key={id}
            onClick={() => scrollToSection(id)}
            sx={{
              py: 0.5,
              backgroundColor: activeSection === id ? 'grey.200' : 'inherit',
              '& .MuiListItemText-primary': {
                color: activeSection === id ? 'primary.main' : 'inherit',
              },
              '& .MuiListItemIcon-root .MuiSvgIcon-root': {
                color: activeSection === id ? 'primary.main' : 'grey.500',
                mr: 2,
                fontSize: 16,
              },
            }}
          >
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={label} />
          </ListItemButton>
        ))}
      </List>
    </>
  );
};

export default SectionNavigation;
