// This plugin is used to format text into columns

const __getParameterSuggestions = (key: string): string[] => {
    return {
        numColumns: ['2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        spacing: [
            '8',
            '16',
            '24',
            '32',
            '40',
            '48',
            '56',
            '64',
            '72',
            '80',
            '88',
            '96',
            '104',
            '112',
            '120',
            '128',
            '136',
            '144',
            '152',
            '160',
            '168',
            '176',
            '184',
            '192',
            '200',
            '208',
            '216',
            '224',
            '232',
            '240',
            '248',
            '256',
        ],
        colWidth: [
            '120',
            '128',
            '136',
            '144',
            '152',
            '160',
            '168',
            '176',
            '184',
            '192',
            '200',
            '208',
            '216',
            '224',
            '232',
            '240',
            '248',
            '256',
        ],
    }[key];
};

const _parseParameters = (
    textBox: TextNode,
    numColumns: string,
    spacing: string,
    colWidth: string
): void => {
    const parameters = {
        numColumns: parseInt(numColumns),
        spacing: parseInt(spacing),
        textBox: {
            // TODO: Add text sanitization
            text: textBox.characters,
            posX: textBox.x,
            posY: textBox.y,
            width: textBox.width,
        },
        colWidth: colWidth ? parseInt(colWidth) : 'auto',
    };

    console.log(parameters);
};

const runPlugin = (textBox: TextNode): void => {
    figma.parameters.on(
        'input',
        ({ key, query, result }: ParameterInputEvent) => {
            // TODO: Add 'px' to suggetions
            result.setSuggestions(
                __getParameterSuggestions(key).filter((s) => s.includes(query))
            );
        }
    );

    figma.on('run', ({ parameters }: RunEvent) => {
        if (parameters === undefined) {
            figma.closePlugin('Please enter parameters and try again 😢');
            return;
        }

        const { numColumns, spacing, colWidth } = parameters;
        if (!numColumns || !spacing) {
            figma.closePlugin('Please enter parameters and try again 😢');
            return;
        }

        _parseParameters(textBox, numColumns, spacing, colWidth);
        // TODO: Load fonts
        // TODO: Create text nodes
        // TODO: Create auto-layout with spacing/column width
        // TODO: Place auto-layout frame at original coordinates
        // TODO: Highlight auto-layout frame
        // TODO: Zoom to auto-layout frame
    });
};

const __checkSelection = (): void => {
    let numErrors: number = 0;
    const currentSelection = figma.currentPage.selection;

    if (currentSelection.length !== 1) {
        numErrors++;
    }

    if (currentSelection[0] && currentSelection[0].type !== 'TEXT') {
        numErrors++;
    }

    if (numErrors > 0) {
        figma.closePlugin('Select ONE box with TEXT in it and try again 😢');
        return;
    }

    const textNode = currentSelection[0] as TextNode;
    textNode.getRangeFontName(0, 5);
    runPlugin(textNode);
};

__checkSelection();

// figma.currentPage.selection = nodes;
// figma.viewport.scrollAndZoomIntoView(nodes);
