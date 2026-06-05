import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import type { StudentsPdfProps } from './StudentsPdf.props';
import {
  findWindows,
  getClassesWithChanges,
  getScheduleDiffs,
} from './studentsScheduleUtils';
import { DAYS_OF_WEEK, ROWS_COUNT } from '@/config/global_constants';

Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Roboto',
  },
  title: {
    fontSize: 16,
    marginBottom: 10,
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
    fontSize: 14,
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    backgroundColor: '#f0f0f0',
  },
  firstCell: {
    width: 30,
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
    overflow: 'hidden',
  },
  lastCell: {
    flex: 1,
    padding: 8,
  },
  firstCellLast: {
    width: 30,
    padding: 8,
  },
  headerCell: {
    flex: 1,
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: '#000',
    borderRightStyle: 'solid',
    fontSize: 16,
    fontWeight: 500,
  },
  firstHeaderCell: {
    width: 30,
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: '#000',
    borderRightStyle: 'solid',
    textAlign: 'left',
    fontSize: 16,
    fontWeight: 500,
  },
  lastHeaderCell: {
    flex: 1,
    padding: 8,
    textAlign: 'left',
    fontSize: 16,
    fontWeight: 500,
  },
  firstHeaderCellLast: {
    width: 30,
    padding: 8,
    textAlign: 'left',
    fontSize: 16,
    fontWeight: 500,
  },
  pageIndicator: {
    fontSize: 12,
    marginTop: 10,
    textAlign: 'center',
    color: '#666',
  },
  noChanges: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
    color: '#666',
  },
});

function StudentsPdf({
  standardSchedule,
  changedSchedule,
  classes,
  dayIndex,
}: StudentsPdfProps) {
  classes = JSON.parse(JSON.stringify(classes));

  const changedClasses = getClassesWithChanges(
    classes,
    standardSchedule,
    changedSchedule,
  );
  const scheduleToExport = getScheduleDiffs(changedClasses, changedSchedule);
  const windowsMap = findWindows(scheduleToExport);

  const rows = ROWS_COUNT - 1;
  const maxColumnsPerPage = 9; // Максимум столбцов на странице (включая первый)

  // Если нет изменений - показываем заглушку
  if (changedClasses.length === 0) {
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
        </Page>
      </Document>
    );
  }

  // Разбиваем классы на группы для разных страниц
  const classGroups = [];
  for (let i = 0; i < changedClasses.length; i += maxColumnsPerPage - 1) {
    classGroups.push(changedClasses.slice(i, i + maxColumnsPerPage - 1));
  }

  const getCellStyle = (
    colIndex: number,
    totalCols: number,
    isHeader: boolean = false,
  ) => {
    if (isHeader) {
      if (colIndex === 0) {
        if (colIndex === totalCols - 1) {
          return styles.firstHeaderCellLast;
        }
        return styles.firstHeaderCell;
      }
      if (colIndex === totalCols - 1) {
        return styles.lastHeaderCell;
      }
      return styles.headerCell;
    } else {
      if (colIndex === 0) {
        if (colIndex === totalCols - 1) {
          return styles.firstCellLast;
        }
        return styles.firstCell;
      }
      if (colIndex === totalCols - 1) {
        return styles.lastCell;
      }
      return styles.cell;
    }
  };

  const renderTable = (
    classGroup: typeof changedClasses,
    pageIndex: number,
    totalPages: number,
  ) => {
    const cols = classGroup.length + 1;
    const startIndex = pageIndex * (maxColumnsPerPage - 1);

    return (
      <Page
        key={`page-${pageIndex}`}
        size="A4"
        orientation="landscape"
        style={styles.page}
      >
        <Text style={styles.title}>
          Изменения к расписанию{' '}
          <Text style={{ textTransform: 'lowercase' }}>
            ({DAYS_OF_WEEK[dayIndex].full})
          </Text>
        </Text>

        <View style={styles.table}>
          {/* Заголовки столбцов */}
          <View style={styles.headerRow}>
            <View style={getCellStyle(0, cols, true)}>
              <Text>№</Text>
            </View>
            {classGroup.map((classItem, i) => (
              <View key={`header-${i}`} style={getCellStyle(i + 1, cols, true)}>
                <Text>{classItem.name}</Text>
              </View>
            ))}
          </View>

          {/* Строки данных */}
          {Array(rows)
            .fill(0)
            .map((_, rowIndex) => (
              <View key={`row-${rowIndex}`} style={styles.row}>
                <View style={getCellStyle(0, cols)}>
                  <Text>{rowIndex + 1}</Text>
                </View>
                {classGroup.map((_, colIndex) => {
                  const scheduleIndex = startIndex + colIndex;
                  const scheduleData =
                    scheduleToExport[rowIndex]?.[scheduleIndex];
                  const isWindow = windowsMap[rowIndex]?.[scheduleIndex];

                  return (
                    <View
                      key={`cell-${rowIndex}-${colIndex}`}
                      style={getCellStyle(colIndex + 1, cols)}
                    >
                      {scheduleData?.lesson2 === null &&
                        scheduleData?.lesson1 && (
                          <Text>{scheduleData.lesson1.subject.name}</Text>
                        )}
                      {scheduleData?.lesson2 !== null &&
                        scheduleData?.lesson1 && (
                          <Text>
                            {scheduleData.lesson1.subject.name} /{' '}
                            {scheduleData.lesson2?.subject.name}
                          </Text>
                        )}
                      {isWindow && <Text>—</Text>}
                    </View>
                  );
                })}
              </View>
            ))}
        </View>
      </Page>
    );
  };

  return (
    <Document>
      {classGroups.map((classGroup, index) =>
        renderTable(classGroup, index, classGroups.length),
      )}
    </Document>
  );
}

export default StudentsPdf;