import { DAYS_OF_WEEK, ROWS_COUNT } from '@/config/global_constants';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { TeachersPdfProps } from './TeachersPdf.props';
import { getTeacherLastNameWithInitials } from '@/lib/teacherUtils';
import { findEmptyTeachers, findWindows, getTeacherScheduleDiff, getTeachersWithChanges, transformClassesToReadbleForm } from './teachersPdfUtils';

Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf'
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Roboto',
  },
  title: {
    fontSize: 16,
    marginBottom: 10
  },
  table: {
    display: 'flex',
    width: '100%',
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    textAlign: 'left',
    fontSize: 14
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    backgroundColor: '#f0f0f0'
  },
  firstCell: {
    width: 170,
    overflow: 'hidden',
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: '#000',
    borderRightStyle: 'solid',
  },
  cell: {
    flex: 1,
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: '#000',
    borderRightStyle: 'solid',
  },
  lastCell: {
    flex: 1,
    padding: 8,
  },
  headerCell: {
    flex: 1,
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: '#000',
    borderRightStyle: 'solid',
    fontWeight: 500,
  },
  firstHeaderCell: {
    width: 170,
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: '#000',
    borderRightStyle: 'solid',
    fontWeight: 500,
  },
  lastHeaderCell: {
    flex: 1,
    padding: 8,
    fontWeight: 500,
  },
  pageIndicator: {
    fontSize: 12,
    marginTop: 10,
    textAlign: 'center',
    color: '#666',
  },
  fixedRow: {
    height: 40,
  },
  noChanges: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
    color: '#666',
  },
  // Пустая строка для заполнения
  emptyRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    height: 40,
    opacity: 0, // Невидимая, но занимает место
  },
});

function TeachersPdf({ standardSchedule, changedSchedule, classes, dayIndex, teachers }: TeachersPdfProps) {
  standardSchedule.sort((a, b) => a.orderInDay - b.orderInDay);
  changedSchedule.sort((a, b) => a.orderInDay - b.orderInDay);
  
  const changedTeachers = getTeachersWithChanges(teachers, standardSchedule, changedSchedule, classes);
  const scheduleToExport = getTeacherScheduleDiff(changedTeachers, changedSchedule, classes);
  const emptyIndexes = findEmptyTeachers(scheduleToExport);
  
  [...emptyIndexes].sort((a, b) => b - a).forEach(index => {
    changedTeachers.splice(index, 1);
    scheduleToExport.splice(index, 1);
  });
  
  const windowsMap = findWindows(scheduleToExport);

  const rows = changedTeachers.length;
  const cols = ROWS_COUNT;
  
  // Если нет изменений - показываем заглушку
  if (rows === 0) {
    return (
      <Document>
        <Page size="A4" orientation="landscape" style={styles.page}>
          <Text style={styles.title}>
            Изменения к расписанию{' '}
            <Text style={{ textTransform: 'lowercase' }}>
              ({DAYS_OF_WEEK[dayIndex].full})
            </Text>
          </Text>
          <Text style={styles.noChanges}>
            Нет изменений в расписании
          </Text>
          {/* Заполняем страницу пустыми строками до конца */}
          {/* {Array(25).fill(0).map((_, i) => (
            <View key={`empty-${i}`} style={styles.emptyRow} />
          ))} */}
        </Page>
      </Document>
    );
  }
  
  // Максимальное количество строк на странице
  const maxRowsPerPage = 12;
  
  // Разбиваем данные на страницы
  const pages = [];
  for (let i = 0; i < rows; i += maxRowsPerPage) {
    pages.push({
      startIndex: i,
      endIndex: Math.min(i + maxRowsPerPage, rows),
      teachers: changedTeachers.slice(i, i + maxRowsPerPage),
      schedule: scheduleToExport.slice(i, i + maxRowsPerPage),
      windows: windowsMap.slice(i, i + maxRowsPerPage)
    });
  }

  const getCellStyle = (colIndex: number, isHeader: boolean = false) => {
    if (isHeader) {
      if (colIndex === 0) {
        return styles.firstHeaderCell;
      }
      if (colIndex === cols - 1) {
        return styles.lastHeaderCell;
      }
      return styles.headerCell;
    } else {
      if (colIndex === 0) {
        return styles.firstCell;
      }
      if (colIndex === cols - 1) {
        return styles.lastCell;
      }
      return styles.cell;
    }
  };

  const renderHeader = () => (
    <View style={styles.headerRow} fixed>
      {Array(cols).fill(0).map((_, i) => (
        <View key={`header-${i}`} style={getCellStyle(i, true)}>
          {i === 0 ? <Text></Text> : <Text>{i}</Text>}
        </View>
      ))}
    </View>
  );

  return (
    <Document>
      {pages.map((page, pageIndex) => (
        <Page 
          key={`page-${pageIndex}`} 
          size="A4" 
          orientation="landscape" 
          style={styles.page}
          wrap={false}
        >
          <Text style={styles.title}>
            Изменения к расписанию{' '}
            <Text style={{ textTransform: 'lowercase' }}>
              ({DAYS_OF_WEEK[dayIndex].full})
            </Text>
          </Text>

          {/* {pages.length > 1 && (
            <Text style={styles.pageIndicator}>
              Страница {pageIndex + 1} из {pages.length}
            </Text>
          )} */}

          <View style={styles.table}>
            {renderHeader()}

            {/* Строки данных */}
            {Array(page.endIndex - page.startIndex).fill(0).map((_, rowIndex) => (
              <View 
                key={`row-${rowIndex}`} 
                style={[styles.row, styles.fixedRow]}
              >
                {Array(cols).fill(0).map((_, colIndex) => (
                  <View 
                    key={`cell-${rowIndex}-${colIndex}`} 
                    style={getCellStyle(colIndex)}
                  >
                    {colIndex === 0 && (
                      <Text>{getTeacherLastNameWithInitials(page.teachers[rowIndex])}</Text>
                    )}
                    {colIndex !== 0 && page.schedule[rowIndex]?.[colIndex - 1] !== null && (
                      <Text>
                        {transformClassesToReadbleForm(page.schedule[rowIndex]?.[colIndex - 1]?.classes)}
                      </Text>
                    )}
                    {page.windows[rowIndex]?.[colIndex - 1] && <Text>—</Text>}
                  </View>
                ))}
              </View>
            ))}

            {/* Заполняем пустыми строками до конца страницы, если данных меньше maxRowsPerPage */}
            {Array(maxRowsPerPage - (page.endIndex - page.startIndex)).fill(0).map((_, i) => (
              <View key={`empty-${i}`} style={styles.emptyRow} />
            ))}
          </View>
        </Page>
      ))}
    </Document>
  );
}

export default TeachersPdf;