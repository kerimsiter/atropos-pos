import { Grid, Box, Flex } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { AuthShowcasePanel } from '../../components/Auth/AuthShowcasePanel';
import { RegisterForm } from '../../components/Auth/RegisterForm';
import { AuthHeader } from '../../components/Auth/AuthHeader';

export function RegisterPage(): React.JSX.Element {
  const isMobile = useMediaQuery('(max-width: 480px)');
  const isTablet = useMediaQuery('(max-width: 768px)');
  
  return (
    <Grid gutter={0} bg="neutral.2">
      {/* Sol Sütun: Form Alanı */}
      <Grid.Col
        span={{ base: 12, md: 6, lg: 5 }}
        bg="white"
        style={{ position: 'relative' }}
      >
        <AuthHeader />
        <Flex
          direction="column"
          justify="center"
          style={{ 
            height: isTablet ? 'auto' : '100vh', 
            minHeight: isTablet ? '100vh' : 'auto',
            padding: isMobile ? '70px 12px 20px 12px' : isTablet ? '80px 20px 24px 20px' : '24px' 
          }}
        >
          <Box
            style={{
              maxWidth: isMobile ? '100%' : isTablet ? '400px' : '427px',
              width: '100%',
              margin: '0 auto',
            }}
          >
            <RegisterForm />
          </Box>
        </Flex>
      </Grid.Col>

      {/* Sağ Sütun: Vitrin Alanı */}
      <Grid.Col
        span={{ base: 0, md: 6, lg: 7 }}
        visibleFrom="md"
        bg="#e8f2f2"
      >
        <AuthShowcasePanel />
      </Grid.Col>
    </Grid>
  );
}